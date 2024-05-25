-- Genres table to store subjects
CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);
COMMENT ON TABLE genres IS 'Genres table to store subjects';