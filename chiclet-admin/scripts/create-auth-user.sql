-- Create a demo admin user for testing
-- Note: In production, you should create users through Supabase Auth UI or API
-- This is just for demo purposes

-- Insert demo user (you"'ll need to do this through Supabase dashboard)"
-- Email: admin@demo.com
-- Password: demo123

-- Or you can create it programmatically:
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES (
--   gen_random_uuid(),
--   "'admin@demo.com'",
--   crypt("'demo123'", gen_salt("'bf'")),
--   now(),
--   now(),
--   now()
-- );
