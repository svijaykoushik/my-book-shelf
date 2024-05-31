-- Users table (handled by Supabase Auth, but adding extra fields for profile information)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  profile_image_url text NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE profiles IS 'Users table (handled by Supabase Auth, but adding extra fields for profile information)';
-- set updated at
create extension if not exists moddatetime schema extensions;
create trigger handle_updated_at before
update on profiles for each row execute procedure moddatetime(updated_at);
-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
create policy "select_profiles_policy" on "public"."profiles" as PERMISSIVE for
SELECT to public using (
    (
      select auth.uid()
    ) = id
  );
-- inserts a row into public.profiles
create function public.handle_new_user() returns trigger language plpgsql security definer
set search_path = '' as $$ begin
insert into public.profiles (id, first_name, last_name)
values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
return new;
end;
$$;
-- trigger the function every time a user is created
create trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();