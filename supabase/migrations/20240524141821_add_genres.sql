-- Genres table to store subjects
CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
COMMENT ON TABLE genres IS 'Genres table to store subjects';

ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

create policy "select_genres_policy"

on "public"."genres"

as PERMISSIVE

for SELECT

to authenticated

using (
 true
 );
