-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Anyone can read roles (needed for UI)
CREATE POLICY "Roles are viewable by authenticated users"
  ON public.user_roles FOR SELECT TO authenticated USING (true);

-- Only admins can insert roles
CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete roles
CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Auto-assign 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Allow admins to delete any booking
CREATE POLICY "Admins can delete any booking"
  ON public.bookings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all profiles
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add 'user' role to existing users who don't have one
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user' FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_roles WHERE role = 'user');