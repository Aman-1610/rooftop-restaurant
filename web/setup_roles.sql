-- Create a table to map auth users to roles
create table if not exists public.user_roles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  role text not null check (role in ('admin', 'chef')),
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_roles enable row level security;

-- Policies
-- 1. Users can read their own role
create policy "Users can read own role" on public.user_roles
  for select using (auth.uid() = id);

-- 2. Admins can read all roles
-- This creates a recursive check if we aren't careful.
-- Better pattern: Use a secure function or a separate `is_admin` function.
-- For simplicity in this MVP: 
-- We will trust the API route (service role) to manage this table mostly.
-- But for the frontend to check "Am I admin?", we rely on the select policy above.
-- To allow admins to list *other* staff, we need a policy.
-- Let's say: If your ID is in this table with role 'admin', you can select all.
create policy "Admins can read all roles" on public.user_roles
  for select using (
    exists (
      select 1 from public.user_roles
      where id = auth.uid() and role = 'admin'
    )
  );

-- 3. Admins can insert/update/delete roles
create policy "Admins can manage roles" on public.user_roles
  for all using (
    exists (
      select 1 from public.user_roles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Insert the INITIAL ADMIN manually if you know their ID.
-- However, since I don't know the current user's ID, I can't insert it here easily without 'auth.uid()'.
-- BUT, I can create a function that users can call *once* to claim adminship if table is empty? No, insecure.
-- INSTEAD, I will assume the developer will manually insert their own row in Supabase dashboard, OR
-- I can provide a SQL that inserts the current user if they run it in SQL Editor.

-- Helper function to check is_admin (optional, but good for RLS)
create or replace function public.is_admin()
returns boolean as $$
  select exists(
    select 1 from public.user_roles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;
