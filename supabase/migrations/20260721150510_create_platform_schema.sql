/*
# Create platform schema for group portfolio + job marketplace

1. New Tables
- `members` — team member profiles (slug, name, title, bio, skills, links, avatar).
- `projects` — portfolio case studies (slug, title, summary, problem, solution, outcome, body, category, technologies, demo url, completion date, status, featured, cover image, display order).
- `project_members` — join table crediting members on projects (project, member, role, contribution).
- `contact_messages` — general contact form submissions (name, email, subject, body, source page).
- `job_requests` — structured client job requests (idempotency key, title, description, service, budget min/max, currency, dates, contact details, status, source project).

2. Security
- Enable RLS on every table.
- Public read on published projects, public members, and public project_members.
- Anyone (anon + authenticated) can insert contact_messages and job_requests.
- No public update/delete on any table (all writes are server-side via service role or future admin UI).

3. Notes
- This is a no-auth public portfolio + lead intake app. There is no sign-in screen in the MVP, so policies use `TO anon, authenticated` for public reads and public inserts.
- Slugs are unique. Project status is constrained to a fixed set; only `PUBLISHED` projects are publicly readable.
- Money is stored as integer minor units (cents) to avoid floating point errors.
- Timestamps are UTC timestamptz.
*/

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  full_name text NOT NULL,
  title text NOT NULL,
  bio text NOT NULL,
  experience_summary text,
  location text,
  email text,
  phone text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  avatar_url text,
  skills text[] NOT NULL DEFAULT '{}',
  certifications text[] NOT NULL DEFAULT '{}',
  achievements text[] NOT NULL DEFAULT '{}',
  availability_status text NOT NULL DEFAULT 'available',
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_members" ON members;
CREATE POLICY "public_read_members" ON members FOR SELECT
  TO anon, authenticated USING (true);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  short_summary text NOT NULL,
  problem text,
  solution text,
  outcome text,
  body text,
  category text NOT NULL,
  technologies text[] NOT NULL DEFAULT '{}',
  demo_url text,
  source_code_url text,
  cover_image_url text,
  completion_date date,
  status text NOT NULL DEFAULT 'DRAFT',
  featured boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT projects_status_check CHECK (status IN ('DRAFT','SUBMITTED','CHANGES_REQUESTED','APPROVED','PUBLISHED','ARCHIVED'))
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_projects" ON projects;
CREATE POLICY "public_read_published_projects" ON projects FOR SELECT
  TO anon, authenticated USING (status = 'PUBLISHED');

-- Project members join table
CREATE TABLE IF NOT EXISTS project_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  role_on_project text NOT NULL,
  contribution text NOT NULL,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, member_id)
);

ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_project_members" ON project_members;
CREATE POLICY "public_read_project_members" ON project_members FOR SELECT
  TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM projects p WHERE p.id = project_id AND p.status = 'PUBLISHED')
  );

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  source_page text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Job requests table
CREATE TABLE IF NOT EXISTS job_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key text UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  service_type text NOT NULL,
  budget_min_cents integer,
  budget_max_cents integer,
  currency text NOT NULL DEFAULT 'USD',
  preferred_start_date date,
  target_completion_date date,
  flexibility text,
  name text NOT NULL,
  email text NOT NULL,
  company text,
  country text,
  phone text,
  preferred_contact_method text NOT NULL DEFAULT 'email',
  status text NOT NULL DEFAULT 'SUBMITTED',
  source_project_slug text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT job_status_check CHECK (status IN ('DRAFT','SUBMITTED','UNDER_REVIEW','CLARIFICATION_REQUIRED','QUALIFIED','QUOTE_SENT','ACCEPTED','IN_PROGRESS','CLIENT_REVIEW','COMPLETED','REJECTED','WITHDRAWN','CANCELLED','ON_HOLD'))
);

ALTER TABLE job_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_job_requests" ON job_requests;
CREATE POLICY "public_insert_job_requests" ON job_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_members_display_order ON members(display_order);
CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_member ON project_members(member_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_job_requests_created ON job_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_job_requests_status ON job_requests(status);
