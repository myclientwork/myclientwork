/*
# Add job postings and applications

1. New Tables
- `job_postings` — job positions posted by admins
  - id, slug, title, description, category, technologies[], experience_level, budget_min_cents, budget_max_cents, currency, location, remote_ok, status (DRAFT/PUBLISHED/CLOSED), deadline, created_by (admin user_id), created_at, updated_at
- `job_applications` — users applying to job postings
  - id, job_id (FK), user_id (FK auth.users), cover_letter, proposed_budget_cents, currency, availability_date, portfolio_url, status (SUBMITTED/UNDER_REVIEW/ACCEPTED/REJECTED), created_at, updated_at

2. Security
- RLS on both tables.
- job_postings: public read on PUBLISHED; admin insert/update/delete.
- job_applications: authenticated users insert their own; authenticated users read their own; admins read all; admin update status.

3. Notes
- This separates "job postings" (admin-created positions) from the existing "job_requests" (client project requests).
- Only admins can create job postings (enforced by RLS checking user_profiles.role = 'admin').
- Any visitor can browse published job postings.
- Only logged-in users can submit applications (insert with user_id = auth.uid()).
*/

-- Job postings table
CREATE TABLE IF NOT EXISTS job_postings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  technologies text[] NOT NULL DEFAULT '{}',
  experience_level text NOT NULL DEFAULT 'entry',
  budget_min_cents integer,
  budget_max_cents integer,
  currency text NOT NULL DEFAULT 'USD',
  location text,
  remote_ok boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'DRAFT',
  deadline date,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT job_postings_status_check CHECK (status IN ('DRAFT', 'PUBLISHED', 'CLOSED')),
  CONSTRAINT job_postings_experience_check CHECK (experience_level IN ('entry', 'junior', 'mid', 'senior', 'lead', 'any'))
);

ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;

-- Public can read published postings; authenticated can read published too
DROP POLICY IF EXISTS "public_read_published_job_postings" ON job_postings;
CREATE POLICY "public_read_published_job_postings" ON job_postings FOR SELECT
  TO anon, authenticated
  USING (status = 'PUBLISHED');

-- Admins can read all postings (including drafts)
DROP POLICY IF EXISTS "admin_read_all_job_postings" ON job_postings;
CREATE POLICY "admin_read_all_job_postings" ON job_postings FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admins can insert postings
DROP POLICY IF EXISTS "admin_insert_job_postings" ON job_postings;
CREATE POLICY "admin_insert_job_postings" ON job_postings FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admins can update postings
DROP POLICY IF EXISTS "admin_update_job_postings" ON job_postings;
CREATE POLICY "admin_update_job_postings" ON job_postings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Admins can delete postings
DROP POLICY IF EXISTS "admin_delete_job_postings" ON job_postings;
CREATE POLICY "admin_delete_job_postings" ON job_postings FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_letter text NOT NULL,
  proposed_budget_cents integer,
  currency text NOT NULL DEFAULT 'USD',
  availability_date date,
  portfolio_url text,
  status text NOT NULL DEFAULT 'SUBMITTED',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT job_applications_status_check CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN')),
  UNIQUE (job_id, user_id)
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read their own applications
DROP POLICY IF EXISTS "users_read_own_applications" ON job_applications;
CREATE POLICY "users_read_own_applications" ON job_applications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can read all applications
DROP POLICY IF EXISTS "admin_read_all_applications" ON job_applications;
CREATE POLICY "admin_read_all_applications" ON job_applications FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Authenticated users can insert their own application
DROP POLICY IF EXISTS "users_insert_own_application" ON job_applications;
CREATE POLICY "users_insert_own_application" ON job_applications FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own application (e.g., withdraw)
DROP POLICY IF EXISTS "users_update_own_application" ON job_applications;
CREATE POLICY "users_update_own_application" ON job_applications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can update application status
DROP POLICY IF EXISTS "admin_update_applications" ON job_applications;
CREATE POLICY "admin_update_applications" ON job_applications FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_category ON job_postings(category);
CREATE INDEX IF NOT EXISTS idx_job_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_user ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
