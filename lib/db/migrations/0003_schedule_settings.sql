CREATE TABLE "schedule_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"open_minute" integer DEFAULT 420 NOT NULL,
	"close_minute" integer DEFAULT 1260 NOT NULL,
	"slot_minutes" integer DEFAULT 15 NOT NULL,
	"slot_capacity" integer DEFAULT 6 NOT NULL,
	"days_ahead" integer DEFAULT 7 NOT NULL,
	"lead_minutes" integer DEFAULT 30 NOT NULL,
	"blackout_dates" text[] DEFAULT '{}' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "schedule_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "schedule_settings are readable by everyone" ON "schedule_settings" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
INSERT INTO "schedule_settings" ("id") VALUES (1) ON CONFLICT DO NOTHING;
