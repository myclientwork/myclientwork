/*
# Allow admins to update any user's profile (for role management)

The existing "users_update_own_profile" policy only allows users to update
their own row. Admins need to be able to promote/demote other users via
the admin panel. This adds a separate policy for admin updates.
*/

DROP POLICY IF EXISTS "admin_update_all_profiles" ON user_profiles;
CREATE POLICY "admin_update_all_profiles" ON user_profiles FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles up WHERE up.id = auth.uid() AND up.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles up WHERE up.id = auth.uid() AND up.role = 'admin'));
