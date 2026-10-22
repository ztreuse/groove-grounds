-- Ledger reasons are machine keys: join, order, redeem.
UPDATE "reps_ledger" SET "reason" = 'join' WHERE "reason" = 'Joined the crew';--> statement-breakpoint
UPDATE "reps_ledger" SET "reason" = 'order' WHERE "reason" = 'Order';--> statement-breakpoint
CREATE UNIQUE INDEX "reps_ledger_order_earned" ON "reps_ledger" USING btree ("order_id") WHERE "reps_ledger"."reason" = 'order';--> statement-breakpoint
-- New members get the 50-Rep joining bonus with their profile.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, reps)
  VALUES (
    NEW.id,
    nullif(left(trim(NEW.raw_user_meta_data ->> 'name'), 60), ''),
    nullif(left(regexp_replace(coalesce(NEW.raw_user_meta_data ->> 'phone', ''), '[\s-]', '', 'g'), 20), ''),
    50
  )
  ON CONFLICT (id) DO NOTHING;
  IF FOUND THEN
    INSERT INTO public.reps_ledger (user_id, points, reason)
    VALUES (NEW.id, 50, 'join');
  END IF;
  RETURN NEW;
END;
$$;
