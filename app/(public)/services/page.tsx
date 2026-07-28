import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Blocks,
  Check,
  CheckCircle2,
  Cloud,
  Code2,
  Database,
  Gauge,
  GitBranch,
  Headphones,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Software Development Services',
  description:
    'Product-focused web development, backend APIs, security engineering, database optimization, cloud deployment, and ongoing technical support.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Software Development Services | MyClientWork',
    description:
      'From product discovery to deployment and support, build reliable software with a clear scope and production-ready delivery.',
    url: '/services',
  },
};

const services = [
  {
    id: 'web-applications',
    number: '01',
    icon: Code2,
    title: 'Web Application Development',
    summary:
      'Responsive, accessible web products built around your users and business workflow—not just a collection of screens.',
    bestFor: 'Portals, dashboards, marketplaces, SaaS products, and internal tools.',
    deliverables: [
      'Product architecture and technical plan',
      'Responsive frontend and design system',
      'Authentication and role-based access',
      'Testing, deployment, and handover',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 'backend-apis',
    number: '02',
    icon: Layers3,
    title: 'Backend Systems & APIs',
    summary:
      'Maintainable APIs and backend services designed for predictable performance, clear ownership, and future growth.',
    bestFor: 'New product backends, third-party integrations, and legacy API upgrades.',
    deliverables: [
      'API contracts and data-flow design',
      'Validation and error handling',
      'Authentication and permissions',
      'Integration documentation',
    ],
    technologies: ['Node.js', 'REST APIs', 'Supabase', 'Express'],
  },
  {
    id: 'security',
    number: '03',
    icon: ShieldCheck,
    title: 'Security Engineering',
    summary:
      'Practical security improvements across identity, data access, sessions, storage, and application architecture.',
    bestFor: 'Sensitive workflows, multi-role products, and pre-launch security reviews.',
    deliverables: [
      'Authentication and authorization review',
      'Row-level and role-based access controls',
      'Secure session and storage configuration',
      'Risk findings with prioritized fixes',
    ],
    technologies: ['RBAC', 'RLS', 'OAuth', 'Audit Logging'],
  },
  {
    id: 'cloud-devops',
    number: '04',
    icon: Cloud,
    title: 'Cloud, CI/CD & DevOps',
    summary:
      'Repeatable deployments and sensible operational tooling that make releases safer and easier to maintain.',
    bestFor: 'Production launches, deployment modernization, and release automation.',
    deliverables: [
      'Production environment configuration',
      'Continuous integration and delivery',
      'Domain, SSL, and environment setup',
      'Monitoring and release documentation',
    ],
    technologies: ['Netlify', 'Vercel', 'AWS', 'GitHub Actions'],
  },
  {
    id: 'data-performance',
    number: '05',
    icon: Database,
    title: 'Data & Performance Optimization',
    summary:
      'Database and application improvements that reduce unnecessary work and keep the experience responsive as usage grows.',
    bestFor: 'Slow dashboards, growing datasets, and applications with heavy queries.',
    deliverables: [
      'Schema and query review',
      'Indexes and pagination strategy',
      'Frontend loading and bundle improvements',
      'Measured performance recommendations',
    ],
    technologies: ['PostgreSQL', 'MongoDB', 'Caching', 'Core Web Vitals'],
  },
  {
    id: 'modernization',
    number: '06',
    icon: Smartphone,
    title: 'Product Modernization',
    summary:
      'Focused upgrades for existing products—from dated interfaces and fragile code to smoother, maintainable experiences.',
    bestFor: 'Existing applications that need a redesign, upgrade, or mobile-ready refresh.',
    deliverables: [
      'Current-product technical audit',
      'Incremental modernization roadmap',
      'Responsive UX and accessibility fixes',
      'Safe framework and dependency upgrades',
    ],
    technologies: ['UX Refresh', 'PWA', 'Migration', 'Accessibility'],
  },
];

const principles = [
  {
    icon: MessageSquareText,
    title: 'Clear communication',
    description: 'Defined milestones, visible progress, and decisions documented as the work moves forward.',
  },
  {
    icon: GitBranch,
    title: 'Reviewable delivery',
    description: 'Work is organized in branches and reviewed before it reaches your production environment.',
  },
  {
    icon: Gauge,
    title: 'Performance-aware',
    description: 'Loading behavior, data access, and bundle impact are considered during implementation.',
  },
  {
    icon: Headphones,
    title: 'Useful handover',
    description: 'You receive maintainable code, deployment notes, and practical guidance for what comes next.',
  },
];

const process = [
  {
    step: '01',
    icon: Search,
    title: 'Discover',
    description:
      'We clarify the problem, users, priorities, constraints, and the outcome the project needs to create.',
  },
  {
    step: '02',
    icon: Blocks,
    title: 'Plan',
    description:
      'We turn the scope into milestones, technical decisions, acceptance criteria, and a delivery sequence.',
  },
  {
    step: '03',
    icon: Code2,
    title: 'Build & review',
    description:
      'We implement in reviewable increments, validate the important paths, and share progress throughout.',
  },
  {
    step: '04',
    icon: Rocket,
    title: 'Launch & support',
    description:
      'We prepare production, verify the release, document the system, and support the transition after launch.',
  },
];

const engagementOptions = [
  {
    icon: Sparkles,
    title: 'Focused improvement',
    description:
      'A defined upgrade to one part of your existing product, such as performance, authentication, UX, or deployment.',
    fit: 'Best when the goal and affected area are already clear.',
  },
  {
    icon: Layers3,
    title: 'Product build',
    description:
      'A milestone-based engagement covering discovery, implementation, launch, and technical handover.',
    fit: 'Best for a new product or a substantial feature set.',
  },
  {
    icon: Headphones,
    title: 'Ongoing engineering',
    description:
      'Continued improvements, maintenance, monitoring, and delivery support for an active product.',
    fit: 'Best for teams that need dependable technical capacity over time.',
  },
];

const faqs = [
  {
    question: 'What do you need from me to estimate a project?',
    answer:
      'A short description of the problem, the main users, the features you consider essential, and any deadline or technical constraints. Existing designs or code are useful, but they are not required for the first conversation.',
  },
  {
    question: 'Can you improve an existing codebase?',
    answer:
      'Yes. We can begin with a focused technical and UX review, identify the highest-impact risks, and implement upgrades incrementally so the existing product can continue operating.',
  },
  {
    question: 'How will I know what is being worked on?',
    answer:
      'Work is broken into clear milestones and reviewable branches. Progress, decisions, blockers, and validation results are shared throughout the engagement.',
  },
  {
    question: 'Do you provide support after launch?',
    answer:
      'Yes. Handover and launch verification are included in delivery, and ongoing maintenance or improvement support can be arranged based on the product’s needs.',
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'MyClientWork software development services',
  itemListElement: services.map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: service.title,
      description: service.summary,
      provider: {
        '@type': 'Organization',
        name: 'MyClientWork',
        url: 'https://www.myclientwork.online',
      },
    },
  })),
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <section className="relative isolate overflow-hidden border-b border-border/60 bg-secondary/20">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent"
        />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-sm font-medium text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Product-focused software services
            </div>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              From a good idea to software people can rely on.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              We design, build, secure, and improve digital products with a
              clear delivery process—from the first technical decision through
              production launch.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/post-a-job">
                  Discuss your project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/projects">See completed work</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {['Clear scope', 'Reviewable milestones', 'Production-ready handover'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          <Card className="relative overflow-hidden border-primary/15 bg-background/90 shadow-xl shadow-primary/5">
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl"
            />
            <CardContent className="relative p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Start with the outcome
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Not sure which service fits?
              </h2>
              <p className="mt-3 leading-7 text-muted-foreground">
                Tell us what is slowing the product down or what you want to
                launch. We&apos;ll help shape it into a practical technical plan.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  'Review the current situation',
                  'Identify the highest-impact work',
                  'Define a safe delivery sequence',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-lg border border-border/70 bg-secondary/30 p-3"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Button asChild variant="link" className="mt-5 h-auto px-0">
                <Link href="/contact">
                  Ask a question first
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <nav
        aria-label="Service categories"
        className="border-b border-border/60 bg-background"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          {services.map((service) => (
            <a
              key={service.id}
              href={`#${service.id}`}
              className="whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {service.title}
            </a>
          ))}
        </div>
      </nav>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              What we can build together
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Services shaped around real product needs
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Choose a focused capability or combine several into one
              milestone-based delivery plan.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {services.map((service) => (
              <Card
                id={service.id}
                key={service.id}
                className="group scroll-mt-28 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="flex items-start justify-between border-b border-border/60 bg-secondary/20 p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <service.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.16em] text-primary">
                          SERVICE {service.number}
                        </p>
                        <h3 className="mt-1 text-xl font-semibold">{service.title}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="leading-7 text-muted-foreground">{service.summary}</p>
                    <div className="mt-5 rounded-lg border border-border/70 bg-secondary/20 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                        A strong fit for
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {service.bestFor}
                      </p>
                    </div>

                    <p className="mt-6 text-sm font-semibold">Typical deliverables</p>
                    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                      {service.deliverables.map((deliverable) => (
                        <li
                          key={deliverable}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {service.technologies.map((technology) => (
                        <span
                          key={technology}
                          className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-secondary/25 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Delivery principles
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Good engineering should feel predictable.
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                The technical work matters, but so does knowing what is
                happening, what has been validated, and what you will own when
                the project is complete.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {principles.map((principle) => (
                <div
                  key={principle.title}
                  className="rounded-xl border border-border/70 bg-background p-5"
                >
                  <principle.icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 font-semibold">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              How the work moves
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A clear path from discovery to launch
            </h2>
            <p className="mt-4 text-muted-foreground">
              Each stage produces something concrete you can review before the
              next stage begins.
            </p>
          </div>

          <ol className="relative mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {process.map((item, index) => (
              <li key={item.step} className="relative">
                {index < process.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute left-[calc(50%+2rem)] right-[calc(-50%+2rem)] top-7 hidden h-px bg-border lg:block"
                  />
                )}
                <Card className="relative h-full bg-background">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold text-primary/50">{item.step}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-border/60 bg-secondary/25 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Ways to work together
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Choose the engagement that matches the work
            </h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {engagementOptions.map((option) => (
              <Card key={option.title} className="h-full">
                <CardContent className="p-6">
                  <option.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-5 text-xl font-semibold">{option.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    {option.description}
                  </p>
                  <p className="mt-5 border-t border-border/60 pt-4 text-sm font-medium">
                    {option.fit}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Common questions
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Before we get started
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              A few practical answers about scope, existing products, delivery,
              and support.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-border bg-background open:border-primary/30 open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {faq.question}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-lg text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="px-5 pb-5 pr-14 text-sm leading-7 text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl bg-primary px-6 py-12 text-primary-foreground shadow-xl sm:px-10 lg:px-14">
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl"
          />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary-foreground/80">
                <LockKeyhole className="h-4 w-4" />
                Your project details are reviewed privately
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                What should we improve or build next?
              </h2>
              <p className="mt-4 leading-7 text-primary-foreground/80">
                Share the goal, current challenge, and timeline. We&apos;ll use
                that context to recommend a practical next step.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild size="lg" variant="secondary">
                <Link href="/post-a-job">
                  Submit project details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/contact">Contact the team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
