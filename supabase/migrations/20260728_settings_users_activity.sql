/*
# Add site_settings, user_activity_log, expand user_profiles roles & status

1. New Tables
  - `site_settings` — key-value store for website configuration
  - `user_activity_log` — tracks user login/activity events

2. Modified Tables
  - `user_profiles` — add `status` column, expand `role` check constraint

3. Storage
  - `site-assets` bucket for logo/favicon uploads

4. RLS Policies
  - site_settings: admins can CRUD, public can read
  - user_activity_log: admins can read, authenticated can insert own
  - user_profiles: admins can delete (with safeguards in app code)
*/

-- ============================================================
-- 1. site_settings table
-- ============================================================
DROP TABLE IF EXISTS site_settings CASCADE;

CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed to render site)
DROP POLICY IF EXISTS "public_read_settings" ON site_settings;
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can insert/update/delete settings
DROP POLICY IF EXISTS "admin_manage_settings" ON site_settings;
CREATE POLICY "admin_manage_settings" ON site_settings FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Seed default settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'MyClientWork'),
  ('site_tagline', 'Digital Services. Professional Solutions. Growth.'),
  ('logo_url', '/images/1784378767326_(1).png'),
  ('favicon_url', '/favicon.ico'),
  ('hero_title', 'Digital Services. Professional Solutions. Growth.'),
  ('hero_subtitle', 'Explore the work completed by our team, understand our capabilities, and post your project requirements to work with us.'),
  ('hero_cta_text', 'Get Started'),
  ('hero_cta_link', '/contact'),
  ('hero_bg_image', ''),
  ('primary_color', ''),
  ('accent_color', ''),
  ('seo_title', 'MyClientWork — Digital Services. Professional Solutions. Growth.'),
  ('seo_description', 'Explore the work completed by our team, understand our capabilities, and post your project requirements to work with us.'),
  ('seo_keywords', 'digital services, web development, freelance, professional solutions'),
  ('seo_og_image', ''),
  ('social_facebook', ''),
  ('social_twitter', ''),
  ('social_linkedin', ''),
  ('social_instagram', ''),
  ('social_youtube', ''),
  ('social_github', ''),
  ('contact_email', ''),
  ('contact_phone', ''),
  ('contact_address', ''),
  ('contact_maps_url', ''),
  ('maintenance_mode', 'false'),
  ('maintenance_message', 'We are currently performing scheduled maintenance. Please check back soon.')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- 2. user_activity_log table
-- ============================================================
CREATE TABLE IF NOT EXISTS user_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event text NOT NULL DEFAULT 'login',
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_user ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON user_activity_log(created_at DESC);

ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

-- Admins can read all activity logs
DROP POLICY IF EXISTS "admin_read_activity" ON user_activity_log;
CREATE POLICY "admin_read_activity" ON user_activity_log FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin')));

-- Authenticated users can insert their own activity
DROP POLICY IF EXISTS "user_insert_own_activity" ON user_activity_log;
CREATE POLICY "user_insert_own_activity" ON user_activity_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- 3. Expand user_profiles: add status, expand role constraint
-- ============================================================

-- Add status column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'status'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN status text NOT NULL DEFAULT 'active';
  END IF;
END $$;

-- Drop old role constraint and add expanded one
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('user', 'admin', 'super_admin', 'client', 'freelancer'));

-- Add status constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_status_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_status_check
  CHECK (status IN ('active', 'suspended'));

-- Allow admins to delete user profiles
DROP POLICY IF EXISTS "admin_delete_profiles" ON user_profiles;
CREATE POLICY "admin_delete_profiles" ON user_profiles FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles up WHERE up.id = auth.uid() AND up.role IN ('admin', 'super_admin')));

-- ============================================================
-- 4. Storage bucket for site assets
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow admins to upload to site-assets bucket
DROP POLICY IF EXISTS "admin_upload_site_assets" ON storage.objects;
CREATE POLICY "admin_upload_site_assets" ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'site-assets' AND
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "admin_update_site_assets" ON storage.objects;
CREATE POLICY "admin_update_site_assets" ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'site-assets' AND
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "admin_delete_site_assets" ON storage.objects;
CREATE POLICY "admin_delete_site_assets" ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'site-assets' AND
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Public read for site-assets
DROP POLICY IF EXISTS "public_read_site_assets" ON storage.objects;
CREATE POLICY "public_read_site_assets" ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'site-assets');
