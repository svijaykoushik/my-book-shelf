-- Authors table
CREATE TABLE authors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    birth_year INTEGER,
    death_year INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE authors IS 'Authors table';

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

create policy "select_authors_policy"

on "public"."authors"

as PERMISSIVE

for SELECT

to authenticated

using (
 true
 );
