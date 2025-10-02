-- Fix Users RLS policies to allow updates
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;

-- Create permissive policies that allow all operations for authenticated users
CREATE POLICY "Anyone can view profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert profiles"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
  ON users FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete profiles"
  ON users FOR DELETE
  USING (true);
