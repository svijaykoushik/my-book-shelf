-- Users table (handled by Supabase Auth, but adding extra fields for profile information)
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE profiles IS 'Users table (handled by Supabase Auth, but adding extra fields for profile information)';