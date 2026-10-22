CREATE TABLE "props" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"drink_id" uuid NOT NULL,
	"user_id" uuid,
	"name" text,
	"rating" integer NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "props_order_id_drink_id_unique" UNIQUE("order_id","drink_id")
);
--> statement-breakpoint
ALTER TABLE "props" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "props" ADD CONSTRAINT "props_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "props" ADD CONSTRAINT "props_drink_id_drinks_id_fk" FOREIGN KEY ("drink_id") REFERENCES "public"."drinks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "props" ADD CONSTRAINT "props_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;