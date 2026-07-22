export type Member = {
  id: string;
  slug: string;
  full_name: string;
  title: string;
  bio: string;
  experience_summary: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  avatar_url: string | null;
  skills: string[];
  certifications: string[];
  achievements: string[];
  availability_status: string;
  display_order: number;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  short_summary: string;
  problem: string | null;
  solution: string | null;
  outcome: string | null;
  body: string | null;
  category: string;
  technologies: string[];
  demo_url: string | null;
  source_code_url: string | null;
  cover_image_url: string | null;
  completion_date: string | null;
  status: string;
  featured: boolean;
  is_confidential: boolean;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
};

export type ProjectMember = {
  id: string;
  project_id: string;
  member_id: string;
  role_on_project: string;
  contribution: string;
  display_order: number;
  member: Member;
};

export type ProjectWithMembers = Project & {
  project_members: ProjectMember[];
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  source_page: string | null;
  created_at: string;
};

export type JobRequest = {
  id: string;
  idempotency_key: string | null;
  user_id: string | null;
  title: string;
  description: string;
  service_type: string;
  budget_min_cents: number | null;
  budget_max_cents: number | null;
  currency: string;
  preferred_start_date: string | null;
  target_completion_date: string | null;
  flexibility: string | null;
  name: string;
  email: string;
  company: string | null;
  country: string | null;
  phone: string | null;
  preferred_contact_method: string;
  status: string;
  source_project_slug: string | null;
  created_at: string;
};

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  company: string | null;
  country: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
};

export type JobPosting = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  experience_level: string;
  budget_min_cents: number | null;
  budget_max_cents: number | null;
  currency: string;
  location: string | null;
  remote_ok: boolean;
  status: string;
  deadline: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type JobApplication = {
  id: string;
  job_id: string;
  user_id: string;
  cover_letter: string;
  proposed_budget_cents: number | null;
  currency: string;
  availability_date: string | null;
  portfolio_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type JobApplicationWithJob = JobApplication & {
  job_postings: JobPosting;
};

export type JobApplicationWithUser = JobApplication & {
  user_profiles: Pick<UserProfile, 'id' | 'email' | 'full_name' | 'country' | 'phone'>;
};
