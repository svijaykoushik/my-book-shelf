-- UserBooks table to link users with their books
CREATE TABLE user_books (
    id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES profiles (id) ON DELETE CASCADE,
    book_id uuid REFERENCES books (id) ON DELETE CASCADE,
    status VARCHAR(50), -- e.g., "read", "currently reading", "to be read"
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE user_books IS 'UserBooks table to link users with their books';

create trigger
  handle_updated_at before update
on user_books
for each row execute
  procedure moddatetime(updated_at);

ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;

create policy "select_user_books_policy"

on "public"."user_books"

as PERMISSIVE

for SELECT

to public

using (
 (select auth.uid()) = user_id
 );

create policy "insert_user_books_policy"
on "public"."user_books"
for insert with check (
  (select auth.uid()) = user_id
);

create policy "delete_user_books_policy"
on "public"."user_books"
for delete using (
  (select auth.uid()) = user_id
);