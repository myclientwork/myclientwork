/*
# Fix RLS circular dependency on user_profiles

The original SELECT policy uses a subquery on user_profiles itself to check 
admin role — this can cause empty results when Supabase evaluates the policy.

Fix: Use a SECURITY DEFINER helper function to bypass RLS for the role lookup.
*/

-- Step 1: Create a SECURITY DEFINER function that bypasses RLS to get role
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM user_profiles WHERE id = auth.uid();
$$;

-- Step 2: Rewrite the SELECT policy to avoid circular self-reference
DROP POLICY IF EXISTS "users_read_own_profile" ON user_profiles;
CREATE POLICY "users_read_own_profile" ON user_profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR get_my_role() = 'admin'
  );

-- Step 3: Fix admin update policy
DROP POLICY IF EXISTS "admin_update_all_profiles" ON user_profiles;
CREATE POLICY "admin_update_all_profiles" ON user_profiles FOR UPDATE
  TO authenticated
  USING (get_my_role() = 'admin')
  WITH CHECK (get_my_role() = 'admin');
