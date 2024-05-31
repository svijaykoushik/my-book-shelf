-- BookAuthors table to link books with their authors
CREATE TABLE book_authors (
    id SERIAL PRIMARY KEY,
    book_id uuid REFERENCES books (id) ON DELETE CASCADE,
    author_id uuid REFERENCES authors (id) ON DELETE CASCADE
);
COMMENT ON TABLE book_authors IS 'BookAuthors table to link books with their authors';

ALTER TABLE book_authors ENABLE ROW LEVEL SECURITY;

create policy "select_book_authors_policy"

on "public"."book_authors"

as PERMISSIVE

for SELECT

to authenticated

using (
 true
 );
