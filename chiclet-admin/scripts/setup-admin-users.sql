-- Create admin_users table to control who can access the admin panel
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  avatar_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read admin_users
CREATE POLICY "Allow authenticated users to read admin_users" ON public.admin_users
  FOR SELECT USING (auth.role() = "'authenticated'");

-- Insert demo admin users (replace with your actual admin emails)
INSERT INTO public.admin_users (email, name, is_active) VALUES 
  ("'admin@yourdomain.com'", "'Admin User'", true),
  ("'your-email@gmail.com'", "'Your Name'", true)
ON CONFLICT (email) DO NOTHING;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user(user_email text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = user_email AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
