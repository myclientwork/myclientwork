import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ContactForm } from '@/features/contact/components/contact-form';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with MyClientWork. Send us your project inquiry, partnership proposal, or support request and our team will respond within 24 hours.',
  path: '/contact',
});

const contactCards = [
  {
    icon: Mail,
    title: 'Email',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'hover:border-cyan-500/40',
    content: (
      <a
        href="mailto:myclientwork3@gmail.com"
        className="text-xs text-muted-foreground hover:text-cyan-400 transition-colors font-medium"
      >
        myclientwork3@gmail.com
      </a>
    ),
  },
  {
    icon: Phone,
    title: 'Phone',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'hover:border-indigo-500/40',
    content: (
      <div className="space-y-1">
        <a
          href="tel:+977981621091"
          className="block text-xs text-muted-foreground hover:text-indigo-400 transition-colors font-medium"
        >
          +977-981621091
        </a>
        <a
          href="tel:+9779811138552"
          className="block text-xs text-muted-foreground hover:text-indigo-400 transition-colors font-medium"
        >
          +977-9811138552
        </a>
      </div>
    ),
  },
  {
    icon: MapPin,
    title: 'Location',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'hover:border-purple-500/40',
    content: (
      <div className="space-y-0.5">
        <p className="text-xs text-muted-foreground font-medium">
          Bhubaneswar, Odisha, India
        </p>
        <p className="text-xs text-muted-foreground">
          Serving clients worldwide
        </p>
      </div>
    ),
  },
  {
    icon: Clock,
    title: 'Response Time',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'hover:border-emerald-500/40',
    content: (
      <p className="text-xs text-muted-foreground font-medium">
        We typically respond within 24 hours.
      </p>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <AuroraBackground className="border-b border-border/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Direct Support
            </span>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl text-foreground">
              Get In Touch
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Have a question or want to discuss a project? Send us a message
              and we&apos;ll get back to you with a detailed response.
            </p>
          </div>
        </div>
      </AuroraBackground>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl shadow-lg">
                <CardContent className="p-7 sm:p-10">
                  <h2 className="text-2xl font-black">Send Us a Message</h2>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    Fill out the form below and we&apos;ll respond as soon as
                    possible.
                  </p>
                  <div className="mt-8">
                    <ContactForm />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactCards.map((card) => (
                <Card key={card.title} className={`rounded-2xl border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 ${card.border} hover:shadow-lg`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${card.bg} ${card.color} shadow-sm`}>
                        <card.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{card.title}</h3>
                        <div className="mt-1">{card.content}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
