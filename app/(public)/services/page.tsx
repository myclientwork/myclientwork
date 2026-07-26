import Link from 'next/link';
import {
  Code2,
  Shield,
  Rocket,
  Layers,
  Database,
  Smartphone,
  Cloud,
  GitBranch,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Services',
  description:
    'Full-stack web development, security engineering, cloud deployment, and API design services offered by our team.',
};

const services = [
  {
    icon: Code2,
    title: 'Full-Stack Web Development',
    description:
      'End-to-end web applications using the MERN stack, Next.js, and TypeScript. From user authentication to real-time features, we build complete products.',
    features: [
      'React.js & Next.js frontend',
      'Node.js & Express.js backend',
      'TypeScript for type safety',
      'Tailwind CSS responsive UI',
      'JWT authentication & RBAC',
      'Real-time notifications',
    ],
  },
  {
    icon: Shield,
    title: 'Security Engineering',
    description:
      'Security is not an afterthought. We implement encryption, access control, and formally validated protocols to protect your data and users.',
    features: [
      'Client-side encryption (AES-GCM)',
      'Zero Trust IAM architecture',
      'Role-based access control',
      'Secure session management',
      'Audit logging',
      'ProVerif protocol validation',
    ],
  },
  {
    icon: Rocket,
    title: 'Cloud Deployment & DevOps',
    description:
      'CI/CD pipelines, containerization, and cloud infrastructure setup for reliable, high-availability deployments.',
    features: [
      'AWS (EC2, S3) deployment',
      'Microsoft Azure & DevOps',
      'Docker containerization',
      'GitHub Actions CI/CD',
      'Vercel deployment',
      'Infrastructure automation',
    ],
  },
  {
    icon: Layers,
    title: 'API & Backend Design',
    description:
      'Scalable RESTful APIs and microservices with optimized database queries for fast, reliable performance under load.',
    features: [
      'RESTful API design',
      'MVC architecture',
      'Database indexing & optimization',
      'Sub-100ms response times',
      'Connection pooling',
      'Error-handling middleware',
    ],
  },
  {
    icon: Database,
    title: 'Database Design',
    description:
      'Efficient database schemas for MongoDB and MySQL with indexing strategies that keep queries fast as data grows.',
    features: [
      'MongoDB & Mongoose',
      'MySQL & SQL optimization',
      'Schema design',
      'Query optimization',
      'Data modeling',
      'Indexing strategies',
    ],
  },
  {
    icon: Smartphone,
    title: 'Cross-Platform Apps',
    description:
      'Mobile and cross-platform applications using Flutter, with responsive design that works across all devices.',
    features: [
      'Flutter mobile apps',
      'Responsive web design',
      'Progressive Web Apps',
      'Touch-friendly interfaces',
      'Offline support',
      'App store deployment',
    ],
  },
];

const process = [
  {
    step: '01',
    title: 'Discovery',
    description:
      'We discuss your requirements, goals, and constraints to define a clear scope.',
  },
  {
    step: '02',
    title: 'Design & Architecture',
    description:
      'We design the system architecture, database schema, and user experience.',
  },
  {
    step: '03',
    title: 'Development',
    description:
      'We build your application with clean, tested code and regular progress updates.',
  },
  {
    step: '04',
    title: 'Deployment & Support',
    description:
      'We deploy to the cloud, set up monitoring, and provide ongoing support.',
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Our Services
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We offer end-to-end software development services, from
              full-stack web applications to security engineering and cloud
              deployment.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.title}
                className="group transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-secondary/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              How we work
            </h2>
            <p className="mt-4 text-muted-foreground">
              A clear, proven process from first conversation to deployment.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item) => (
              <div key={item.step} className="relative">
                <div className="text-4xl font-bold text-primary/20">
                  {item.step}
                </div>
                <h3 className="mt-2 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to start your project?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Post your job requirements and we&apos;ll review and respond with a
            plan.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
