-- Books table
CREATE TABLE books (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id INTEGER, -- For storing the external ID (e.g., 1342)
    title VARCHAR(255) NOT NULL,
    cover_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE books IS 'Books table';

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

create policy "select_books_policy"

on "public"."books"

as PERMISSIVE

for SELECT

to authenticated

using (
 true
 );
