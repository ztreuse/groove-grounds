import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgPolicy,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { anonRole, authenticatedRole, authUsers } from "drizzle-orm/supabase";

// Data model from docs/PROJECT.md. Prices are whole pesos (₱).
//
// Every table has row level security on. The app talks to Postgres directly
// on the server (which bypasses RLS), so the only policies here are public
// read access to the menu for the browser. Order policies for the live
// tracker come with Realtime in Step 7.

export const roleEnum = pgEnum("role", ["customer", "barista", "owner"]);
export const levelEnum = pgEnum("level", [
  "rookie",
  "cypher_regular",
  "battler",
  "judge",
  "legend",
]);
export const temperatureEnum = pgEnum("temperature", [
  "hot",
  "iced",
  "blended",
]);
export const optionGroupTypeEnum = pgEnum("option_group_type", [
  "single",
  "multi",
  "text",
]);
export const orderTypeEnum = pgEnum("order_type", ["drop_in", "class", "crew"]);
export const orderStatusEnum = pgEnum("order_status", [
  "warm_up",
  "on_deck",
  "full_out",
  "stage_ready",
  "bow",
  "cut",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "demo_gcash",
  "demo_card",
  "pay_at_pickup",
]);
// Simulated only: Demo pay flips pending to paid. No real payments.
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid"]);
export const crewRequestStatusEnum = pgEnum("crew_request_status", [
  "new",
  "quoted",
  "accepted",
  "declined",
]);

const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow();

const publicRead = (table: string) =>
  pgPolicy(`${table} are readable by everyone`, {
    for: "select",
    to: [anonRole, authenticatedRole],
    using: sql`true`,
  });

export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  name: text("name"),
  phone: text("phone"),
  role: roleEnum("role").notNull().default("customer"),
  reps: integer("reps").notNull().default(0),
  level: levelEnum("level").notNull().default("rookie"),
  createdAt,
}).enableRLS();

export const genres = pgTable(
  "genres",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  () => [publicRead("genres")],
);

// Intermission snacks live here too; they have no temps_allowed.
export const drinks = pgTable(
  "drinks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    genreId: uuid("genre_id")
      .notNull()
      .references(() => genres.id),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    danceStyle: text("dance_style").notNull(),
    blurb: text("blurb").notNull(),
    plainDescription: text("plain_description").notNull(),
    basePrice: integer("base_price").notNull(),
    imageUrl: text("image_url"),
    tempsAllowed: temperatureEnum("temps_allowed")
      .array()
      .notNull()
      .default([]),
    // false = "Sitting out".
    isAvailable: boolean("is_available").notNull().default(true),
    isFeatured: boolean("is_featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  () => [publicRead("drinks")],
);

export const optionGroups = pgTable(
  "option_groups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    danceLabel: text("dance_label").notNull(),
    plainLabel: text("plain_label").notNull(),
    type: optionGroupTypeEnum("type").notNull(),
    required: boolean("required").notNull().default(false),
    // For multi groups; text groups use it as the character limit.
    maxSelect: integer("max_select"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  () => [publicRead("option_groups")],
);

export const options = pgTable(
  "options",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => optionGroups.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    danceLabel: text("dance_label").notNull(),
    plainLabel: text("plain_label").notNull(),
    priceDelta: integer("price_delta").notNull().default(0),
    // false = "Sitting out" (e.g. oat milk ran out).
    isAvailable: boolean("is_available").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [unique().on(t.groupId, t.slug), publicRead("options")],
);

// Which Remix groups apply to which drink. The default option counts as part
// of the drink's base price.
export const drinkOptionGroups = pgTable(
  "drink_option_groups",
  {
    drinkId: uuid("drink_id")
      .notNull()
      .references(() => drinks.id, { onDelete: "cascade" }),
    groupId: uuid("group_id")
      .notNull()
      .references(() => optionGroups.id, { onDelete: "cascade" }),
    defaultOptionId: uuid("default_option_id").references(() => options.id, {
      onDelete: "set null",
    }),
  },
  (t) => [
    primaryKey({ columns: [t.drinkId, t.groupId] }),
    publicRead("drink_option_groups"),
  ],
);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 12 }).notNull().unique(),
  userId: uuid("user_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  guestName: text("guest_name"),
  guestPhone: text("guest_phone"),
  type: orderTypeEnum("type").notNull(),
  slotStart: timestamp("slot_start", { withTimezone: true }),
  status: orderStatusEnum("status").notNull().default("warm_up"),
  subtotal: integer("subtotal").notNull(),
  total: integer("total").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentStatus: paymentStatusEnum("payment_status")
    .notNull()
    .default("pending"),
  isDemo: boolean("is_demo").notNull().default(true),
  notes: text("notes"),
  createdAt,
}).enableRLS();

// Snapshots keep old orders correct after menu prices change.
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  // Null for Freestyle drinks.
  drinkId: uuid("drink_id").references(() => drinks.id, {
    onDelete: "set null",
  }),
  nameSnapshot: text("name_snapshot").notNull(),
  baseSnapshot: integer("base_snapshot").notNull(),
  optionsSnapshot: jsonb("options_snapshot").notNull().default([]),
  quantity: integer("quantity").notNull().default(1),
  lineTotal: integer("line_total").notNull(),
}).enableRLS();

export const timeSlots = pgTable("time_slots", {
  id: uuid("id").primaryKey().defaultRandom(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull().unique(),
  capacity: integer("capacity").notNull().default(6),
  bookedCount: integer("booked_count").notNull().default(0),
}).enableRLS();

// Class schedule (Backstage > Class schedule). One row, id 1. Times are
// minutes after midnight, Manila time; blackout dates are "YYYY-MM-DD".
export const scheduleSettings = pgTable(
  "schedule_settings",
  {
    id: integer("id").primaryKey().default(1),
    openMinute: integer("open_minute").notNull().default(420),
    closeMinute: integer("close_minute").notNull().default(1260),
    slotMinutes: integer("slot_minutes").notNull().default(15),
    slotCapacity: integer("slot_capacity").notNull().default(6),
    daysAhead: integer("days_ahead").notNull().default(7),
    leadMinutes: integer("lead_minutes").notNull().default(30),
    blackoutDates: text("blackout_dates").array().notNull().default([]),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [publicRead("schedule_settings")],
);

export const savedChoreo = pgTable("saved_choreo", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  // Drink slug, or a Freestyle base (espresso, cold brew, matcha …).
  base: text("base").notNull(),
  options: jsonb("options").notNull().default([]),
  createdAt,
}).enableRLS();

export const repsLedger = pgTable("reps_ledger", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  orderId: uuid("order_id").references(() => orders.id, {
    onDelete: "set null",
  }),
  // Positive when earned, negative when redeemed.
  points: integer("points").notNull(),
  reason: text("reason").notNull(),
  createdAt,
}).enableRLS();

export const crewRequests = pgTable("crew_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, {
    onDelete: "set null",
  }),
  contact: text("contact").notNull(),
  eventDate: timestamp("event_date", { withTimezone: true }).notNull(),
  headcount: integer("headcount").notNull(),
  details: text("details"),
  status: crewRequestStatusEnum("status").notNull().default("new"),
  quoteAmount: integer("quote_amount"),
  createdAt,
}).enableRLS();
