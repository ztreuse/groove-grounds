CREATE TABLE "cypher_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tag_dance" text NOT NULL,
	"tag_plain" text NOT NULL,
	"title_dance" text NOT NULL,
	"title_plain" text NOT NULL,
	"body_dance" text NOT NULL,
	"body_plain" text NOT NULL,
	"author" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cypher_posts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
-- The three demo posts that used to live in lib/cypher.ts, newest first.
INSERT INTO "cypher_posts" ("tag_dance", "tag_plain", "title_dance", "title_plain", "body_dance", "body_plain", "author", "created_at") VALUES
('Shout-out', 'Community', 'Props to Studio 23 for their showcase', 'Congrats to Studio 23 on their showcase', '24 drinks, one Crew Order, zero missed counts. Fuel for the encore.', 'They ordered 24 drinks for the night. Thanks for choosing us!', 'Studio 23 Crew', now() - interval '2 days'),
('Crew Order', 'Group orders', 'Rolling deep to rehearsal?', 'Ordering for a group?', 'Send a Crew Order a day ahead and we''ll have the whole set ready at your call time.', 'Place a group order a day ahead and we''ll have everything ready at your pickup time.', '@groovegrounds', now() - interval '1 day'),
('Open Style', 'Weekly special', 'This week''s freestyle: Calamansi Cold Foam Latte', 'This week''s special: Calamansi Cold Foam Latte', 'Bright, citrusy, a little off-beat. Only on The Lineup till Sunday.', 'A bright citrus latte, on the menu until Sunday.', '@groovegrounds', now());
