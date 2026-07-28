# MyClientWork — Client Project Requirement Portal

> Production-grade web application platform for digital software agencies. Allows clients to post custom web and mobile app development requirements, track project progress, explore portfolio projects, and manage agency operations.

Built with Next.js 13 (App Router), TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

[![GitHub Repository](https://img.shields.io/badge/GitHub-myclientwork-blue?logo=github)](https://github.com/myclientwork/myclientwork)

---

## Features

- **Client Project Requirement Wizard**: 5-step interactive form for clients to post custom software requirements (web apps, mobile apps, DevOps, API design) including budget ranges, timelines, feature specs, and contact details.
- **Client Dashboard**: Dedicated portal for clients to track the development status of their submitted requirements (`SUBMITTED` → `QUALIFIED` → `IN_PROGRESS` → `COMPLETED`) and manage their profile.
- **Portfolio & Services Showcase**: Showcase completed client projects, technical capabilities, and custom software development services.
- **Admin Control Panel**: Comprehensive dashboard for agency administrators to review submitted client requirements, update status, manage portfolio projects, oversee users, and respond to inquiries.
- **Role-Based Access Control (RBAC)**: Row-Level Security (RLS) policies powered by Supabase with role-based route protection (`admin` vs `user`).
- **Responsive & Premium UI**: Clean design system built with Tailwind CSS, Lucide icons, glassmorphism elements, and responsive mobile-first navigation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 13.5](https://nextjs.org/) (App Router, Server & Client Components) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) & [PostCSS](https://postcss.org/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Backend & Database** | [Supabase](https://supabase.com/) (PostgreSQL, Auth, RLS Policies, Storage) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **Deployment** | Compatible with Vercel, Netlify, or custom Node.js servers |

---

## Getting Started

### Prerequisites

- **Node.js**: v22.x or higher
- **npm** or **yarn** / **pnpm**
- **Supabase Project**: A running Supabase instance with database migrations applied.

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/myclientwork/myclientwork.git
   cd myclientwork
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase project credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```text
myclientwork/
├── app/                  # Next.js App Router pages and layouts
│   ├── about/            # About page
│   ├── admin/            # Administrative management dashboard & routes
│   ├── auth/             # Authentication pages (login, register, callback)
│   ├── contact/          # Contact page
│   ├── dashboard/        # Client user dashboard & routes
│   ├── post-a-job/       # Client project requirement submission wizard
│   ├── privacy/          # Privacy policy page
│   ├── projects/         # Portfolio showcase & project details
│   ├── services/         # Services offered page
│   ├── terms/            # Terms of service page
│   ├── globals.css       # Global CSS and Tailwind design tokens
│   ├── layout.tsx        # Root layout with AuthProvider & Header/Footer
│   └── page.tsx          # Homepage
├── components/           # React components
│   ├── site/             # Site-specific layouts, forms, and guards
│   └── ui/               # Reusable UI primitives (shadcn/ui)
├── hooks/                # Custom React hooks
├── lib/                  # Utilities, types, Supabase client, & Auth Context
│   ├── auth-context.tsx  # Auth state provider and hook
│   ├── supabase.ts      # Validated Supabase client instance
│   ├── types.ts         # TypeScript interfaces & domain types
│   └── utils.ts         # Utility functions (cn, etc.)
├── public/               # Static assets & images
└── supabase/             # Database migrations & seed SQL files
```

---

## Database & Migration Setup

Database schemas and migrations are located in the `supabase/migrations/` directory:

1. `20260721150510_create_platform_schema.sql` — Initial schema (members, projects, job requests, messages).
2. `20260721150601_seed_members_and_projects.sql` — Initial seed data.
3. `20260722010803_add_auth_and_enhanced_features.sql` — User profiles and RLS security policies.
4. `20260722012619_add_job_postings_and_applications.sql` — Job postings and candidate applications schema.
5. `20260722013628_allow_admin_to_update_user_roles.sql` — Admin role assignment policies.
6. `20260722021953_add_products_and_orders.sql` — E-commerce products and orders schema.
7. `20260723041900_fix_rls_circular_dependency.sql` — RLS optimization.
8. `20260724150000_create_storage_buckets.sql` — Storage bucket creation for member avatars.

To apply these to your Supabase project:

```bash
supabase db push
```

---

## Scripts

- `npm run dev` — Starts Next.js development server
- `npm run build` — Compiles and builds production bundle
- `npm run start` — Runs the compiled production server
- `npm run lint` — Runs ESLint checks
- `npm run typecheck` — Runs TypeScript type check (`tsc --noEmit`)

---

## License

Private and proprietary. Developed for MyClientWork.
