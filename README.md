# MyClientWork

> Production-grade web application platform for digital services, team showcase, client job requests, product store, and administrative management.

Built with Next.js 13 (App Router), TypeScript, Tailwind CSS, shadcn/ui, and Supabase.

---

## Features

- **Public Showcase**: Hero landing page, team directory, featured client projects, and service offerings.
- **Client Portal / Job Requests**: Interactive multi-step wizard for clients to submit detailed project requirements, budget, and timeline.
- **User Dashboard**: Client area to track job requests, application status, digital product orders, and manage profile settings.
- **Admin Control Panel**: Comprehensive dashboard to manage team members, portfolio projects, incoming job requests, job postings, candidate applications, contact messages, products, and sales orders.
- **Role-Based Access Control (RBAC)**: Secure authentication powered by Supabase with role-based route protection (`admin` vs `user`).
- **Storage Integration**: File upload capabilities for team member avatars and digital assets via Supabase Storage buckets.
- **Responsive & Modern Design**: Clean design system built with Tailwind CSS, Lucide icons, glassmorphism UI elements, and custom CSS design tokens.

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

- **Node.js**: v18.x or higher
- **npm** or **yarn** / **pnpm**
- **Supabase Project**: A running Supabase instance with database migrations applied.

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd myclientwork-1
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
myclientwork-1/
├── app/                  # Next.js App Router pages and layouts
│   ├── about/            # About page
│   ├── admin/            # Administrative management dashboard & routes
│   ├── auth/             # Authentication pages (login, register, callback)
│   ├── contact/          # Contact page
│   ├── dashboard/        # Client user dashboard & routes
│   ├── jobs/             # Public job postings list & details
│   ├── members/          # Team member directory & profiles
│   ├── post-a-job/       # Client job request submission form
│   ├── privacy/          # Privacy policy page
│   ├── products/         # Digital product marketplace
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

To apply these to your Supabase project, execute the SQL files in order via the Supabase Dashboard SQL Editor or using the Supabase CLI:

```bash
supabase db push
```

---

## Scripts

- `npm run dev` — Starts Next.js development server
- `npm run build` — Compiles and builds production assets
- `npm run start` — Runs the compiled production server
- `npm run lint` — Runs ESLint checks
- `npm run typecheck` — Runs TypeScript type check (`tsc --noEmit`)

---

## License

Private and proprietary. Developed for MyClientWork.
