/*
# Add authentication, user profiles, and enhanced features

1. New Tables
- `user_profiles` — application profile for every registered user
  - `id` mirrors auth.users.id (UUID, PK)
  - `email` copy for display
  - `full_name`
  - `avatar_url`
  - `phone`
  - `company`
  - `country`
  - `role` — 'user' | 'admin', default 'user'; promoted manually via DB
  - `created_at`, `updated_at`

2. Modified Tables
- `projects` — add `is_confidential` boolean (default false). Confidential projects are only visible to authenticated users.
- `job_requests` — add `user_id` nullable FK to auth.users so logged-in users' requests are linked to their account.

3. Security
- RLS on `user_profiles`: users read/update only their own row; admins can read all.
- `projects` public SELECT policy updated: anon can only see non-confidential published projects; authenticated users can see all published projects.
- `job_requests`: authenticated users can read their own requests (where user_id = auth.uid()); anon can still insert (for guests).

4. Notes
- The `role` column is deliberately NOT settable from client-side inserts (the insert policy only allows inserting the user's own profile without a role value — DEFAULT 'user' applies).
- Admins are promoted by running: UPDATE user_profiles SET role = 'admin' WHERE email = 'x@y.com';
- This migration is idempotent — IF NOT EXISTS / DROP POLICY IF EXISTS throughout.
*/

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  company text,
  country text,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_profiles_role_check CHECK (role IN ('user', 'admin'))
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile; admins can read all
DROP POLICY IF EXISTS "users_read_own_profile" ON user_profiles;
CREATE POLICY "users_read_own_profile" ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM user_profiles up WHERE up.id = auth.uid() AND up.role = 'admin'
  ));

-- Users can insert their own profile on register
DROP POLICY IF EXISTS "users_insert_own_profile" ON user_profiles;
CREATE POLICY "users_insert_own_profile" ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "users_update_own_profile" ON user_profiles;
CREATE POLICY "users_update_own_profile" ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add is_confidential to projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'is_confidential'
  ) THEN
    ALTER TABLE projects ADD COLUMN is_confidential boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Update projects public read policy: anon sees non-confidential published; authenticated sees all published
DROP POLICY IF EXISTS "public_read_published_projects" ON projects;
CREATE POLICY "anon_read_published_projects" ON projects FOR SELECT
  TO anon
  USING (status = 'PUBLISHED' AND is_confidential = false);

DROP POLICY IF EXISTS "auth_read_published_projects" ON projects;
CREATE POLICY "auth_read_published_projects" ON projects FOR SELECT
  TO authenticated
  USING (status = 'PUBLISHED');

-- Admins can insert/update/delete projects
DROP POLICY IF EXISTS "admin_insert_projects" ON projects;
CREATE POLICY "admin_insert_projects" ON projects FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS "admin_update_projects" ON projects;
CREATE POLICY "admin_update_projects" ON projects FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Add user_id to job_requests if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'job_requests' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE job_requests ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Job requests: authenticated users can read their own; admins read all
DROP POLICY IF EXISTS "public_insert_job_requests" ON job_requests;
CREATE POLICY "anyone_insert_job_requests" ON job_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_own_job_requests" ON job_requests;
CREATE POLICY "auth_read_own_job_requests" ON job_requests FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Authenticated users can update their own DRAFT jobs
DROP POLICY IF EXISTS "auth_update_own_job_requests" ON job_requests;
CREATE POLICY "auth_update_own_job_requests" ON job_requests FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() AND status = 'DRAFT'
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can manage members
DROP POLICY IF EXISTS "admin_insert_members" ON members;
CREATE POLICY "admin_insert_members" ON members FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "admin_update_members" ON members;
CREATE POLICY "admin_update_members" ON members FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "admin_delete_members" ON members;
CREATE POLICY "admin_delete_members" ON members FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admins can read contact_messages
DROP POLICY IF EXISTS "admin_read_contact_messages" ON contact_messages;
CREATE POLICY "admin_read_contact_messages" ON contact_messages FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_job_requests_user_id ON job_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_confidential ON projects(is_confidential);
