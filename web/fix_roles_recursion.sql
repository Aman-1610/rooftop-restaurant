-- FIX INFINITE RECURSION IN POLICIES

-- 1. Create a secure function to check admin status
-- "SECURITY DEFINER" means this function runs with the privileges of the creator (you/admin),
-- bypassing RLS checks on the table itself, preventing the loop.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public -- Best practice for security definer functions
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Drop the problematic recursive policies
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;

-- 3. Re-create policies using the secure function

-- Users can read their OWN role (Visual confirmation)
CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT USING (
    auth.uid() = id
  );

-- Admins can view ALL roles (for the Staff List)
CREATE POLICY "Admins can read all roles" ON public.user_roles
  FOR SELECT USING (
    is_admin()
  );

-- Admins can insert/update/delete roles (via API or dashboard)
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (
    is_admin()
  );
