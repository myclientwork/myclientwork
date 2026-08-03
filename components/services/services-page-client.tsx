'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Code2,
  Shield,
  Rocket,
  Layers,
  Database,
  Smartphone,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { fadeIn, staggerContainer } from '@/lib/motion';

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
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderHover: 'hover:border-cyan-500/50',
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
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderHover: 'hover:border-emerald-500/50',
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
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderHover: 'hover:border-purple-500/50',
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
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderHover: 'hover:border-amber-500/50',
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
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderHover: 'hover:border-blue-500/50',
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
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    borderHover: 'hover:border-pink-500/50',
  },
];

const processSteps = [
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

export default function ServicesPageClient() {
  return (
    <div className="relative min-h-screen bg-background">
      <AuroraBackground className="border-b border-border/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:py-4">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Full-Spectrum Capabilities
            </span>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl text-foreground">
              Engineering Services
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              End-to-end software development services, from full-stack web applications to security engineering and cloud deployment.
            </p>
          </div>
        </div>
      </AuroraBackground>

      {/* Services Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer(0.1, 0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                variants={fadeIn('up', i * 0.08, 0.5)}
                whileHover={{ y: -6 }}
                className="h-full"
              >
                <Card className={`group h-full overflow-hidden rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 ${service.borderHover} hover:shadow-2xl hover:shadow-primary/5`}>
                  <CardContent className="p-7">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${service.bgColor} ${service.color} shadow-md transition-transform duration-300 group-hover:scale-110`}>
                      <service.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2.5 text-xs"
                        >
                          <Check className={`h-4 w-4 flex-shrink-0 ${service.color}`} />
                          <span className="text-muted-foreground font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="border-y border-border/40 bg-card/10 py-20 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              How We Deliver
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              A clear, proven process from first conversation to production deployment.
            </p>
          </div>
          <motion.div
            variants={staggerContainer(0.12, 0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {processSteps.map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeIn('up', i * 0.1, 0.5)}
                className="relative rounded-2xl border border-border/50 bg-background/60 p-7 backdrop-blur-xl"
              >
                <div className="text-5xl font-black text-primary/15 leading-none">
                  {item.step}
                </div>
                <h3 className="mt-3 text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
        >
          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            Ready to Start Building?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Post your project requirements and our engineering team will respond with a tailored execution plan.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <MagneticButton>
              <Button asChild size="lg" className="h-14 px-8 text-base font-bold rounded-2xl shadow-2xl">
                <Link href="/post-a-job" className="flex items-center gap-2">
                  Post Requirement
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base font-bold rounded-2xl">
                <Link href="/contact">Contact Support</Link>
              </Button>
            </MagneticButton>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
