CREATE TYPE "public"."crew_request_status" AS ENUM('new', 'quoted', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."level" AS ENUM('rookie', 'cypher_regular', 'battler', 'judge', 'legend');--> statement-breakpoint
CREATE TYPE "public"."option_group_type" AS ENUM('single', 'multi', 'text');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('warm_up', 'on_deck', 'full_out', 'stage_ready', 'bow', 'cut');--> statement-breakpoint
CREATE TYPE "public"."order_type" AS ENUM('drop_in', 'class', 'crew');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('demo_gcash', 'demo_card', 'pay_at_pickup');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('customer', 'barista', 'owner');--> statement-breakpoint
CREATE TYPE "public"."temperature" AS ENUM('hot', 'iced', 'blended');--> statement-breakpoint
CREATE TABLE "crew_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"contact" text NOT NULL,
	"event_date" timestamp with time zone NOT NULL,
	"headcount" integer NOT NULL,
	"details" text,
	"status" "crew_request_status" DEFAULT 'new' NOT NULL,
	"quote_amount" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "crew_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "drink_option_groups" (
	"drink_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"default_option_id" uuid,
	CONSTRAINT "drink_option_groups_drink_id_group_id_pk" PRIMARY KEY("drink_id","group_id")
);
--> statement-breakpoint
ALTER TABLE "drink_option_groups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "drinks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"genre_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"dance_style" text NOT NULL,
	"blurb" text NOT NULL,
	"plain_description" text NOT NULL,
	"base_price" integer NOT NULL,
	"image_url" text,
	"temps_allowed" "temperature"[] DEFAULT '{}' NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "drinks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "drinks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "genres" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "genres_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "genres" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "option_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"dance_label" text NOT NULL,
	"plain_label" text NOT NULL,
	"type" "option_group_type" NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"max_select" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "option_groups_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "option_groups" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"dance_label" text NOT NULL,
	"plain_label" text NOT NULL,
	"price_delta" integer DEFAULT 0 NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "options_group_id_slug_unique" UNIQUE("group_id","slug")
);
--> statement-breakpoint
ALTER TABLE "options" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"drink_id" uuid,
	"name_snapshot" text NOT NULL,
	"base_snapshot" integer NOT NULL,
	"options_snapshot" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"line_total" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(12) NOT NULL,
	"user_id" uuid,
	"guest_name" text,
	"guest_phone" text,
	"type" "order_type" NOT NULL,
	"slot_start" timestamp with time zone,
	"status" "order_status" DEFAULT 'warm_up' NOT NULL,
	"subtotal" integer NOT NULL,
	"total" integer NOT NULL,
	"payment_method" "payment_method" NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"is_demo" boolean DEFAULT true NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"phone" text,
	"role" "role" DEFAULT 'customer' NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"level" "level" DEFAULT 'rookie' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reps_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"order_id" uuid,
	"points" integer NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reps_ledger" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "saved_choreo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"base" text NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "saved_choreo" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "time_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"capacity" integer DEFAULT 6 NOT NULL,
	"booked_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "time_slots_starts_at_unique" UNIQUE("starts_at")
);
--> statement-breakpoint
ALTER TABLE "time_slots" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "crew_requests" ADD CONSTRAINT "crew_requests_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drink_option_groups" ADD CONSTRAINT "drink_option_groups_drink_id_drinks_id_fk" FOREIGN KEY ("drink_id") REFERENCES "public"."drinks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drink_option_groups" ADD CONSTRAINT "drink_option_groups_group_id_option_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."option_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drink_option_groups" ADD CONSTRAINT "drink_option_groups_default_option_id_options_id_fk" FOREIGN KEY ("default_option_id") REFERENCES "public"."options"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "drinks" ADD CONSTRAINT "drinks_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "options" ADD CONSTRAINT "options_group_id_option_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."option_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_drink_id_drinks_id_fk" FOREIGN KEY ("drink_id") REFERENCES "public"."drinks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reps_ledger" ADD CONSTRAINT "reps_ledger_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reps_ledger" ADD CONSTRAINT "reps_ledger_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_choreo" ADD CONSTRAINT "saved_choreo_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "drink_option_groups are readable by everyone" ON "drink_option_groups" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "drinks are readable by everyone" ON "drinks" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "genres are readable by everyone" ON "genres" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "option_groups are readable by everyone" ON "option_groups" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "options are readable by everyone" ON "options" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);