ALTER TABLE "crew_requests" ALTER COLUMN "contact" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "crew_requests" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "crew_requests" ADD COLUMN "phone" text NOT NULL;--> statement-breakpoint
ALTER TABLE "crew_requests" ADD COLUMN "drink_mix" text NOT NULL;--> statement-breakpoint
ALTER TABLE "crew_requests" ADD COLUMN "budget" integer;--> statement-breakpoint
ALTER TABLE "crew_requests" ADD COLUMN "quote_note" text;--> statement-breakpoint
ALTER TABLE "crew_requests" ADD COLUMN "quoted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "crew_requests" ADD COLUMN "responded_at" timestamp with time zone;