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