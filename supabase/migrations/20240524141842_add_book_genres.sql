-- BookGenres table to link books with their subjects
CREATE TABLE book_genres (
    id SERIAL PRIMARY KEY,
    book_id uuid REFERENCES books (id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres (id) ON DELETE CASCADE
);
COMMENT ON TABLE book_genres IS 'BookGenres table to link books with their subjects';