-- Every new Supabase Auth user gets a profile row, filled from the sign-up
-- form's metadata (name, phone). The app validates both before sign-up; the
-- limits here just keep direct API sign-ups tidy.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone)
  VALUES (
    NEW.id,
    nullif(left(trim(NEW.raw_user_meta_data ->> 'name'), 60), ''),
    nullif(left(regexp_replace(coalesce(NEW.raw_user_meta_data ->> 'phone', ''), '[\s-]', '', 'g'), 20), '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
--> statement-breakpoint
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
--> statement-breakpoint
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
--> statement-breakpoint
-- Users created before this migration.
INSERT INTO public.profiles (id, name)
SELECT id, nullif(left(trim(raw_user_meta_data ->> 'name'), 60), '')
FROM auth.users
ON CONFLICT (id) DO NOTHING;
