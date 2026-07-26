import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ContactForm } from '@/features/contact/components/contact-form';

export const metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with our team. Send us a message and we will respond to your inquiry.',
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Get in touch
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Have a question or want to discuss a project? Send us a message
              and we&apos;ll get back to you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-xl font-semibold">Send us a message</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fill out the form below and we&apos;ll respond as soon as
                    possible.
                  </p>
                  <div className="mt-6">
                    <ContactForm />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <a
                        href="mailto:myclientwork3@gmail.com"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        myclientwork3@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <a
                        href="tel:+977981621091"
                        className="block text-sm text-muted-foreground hover:text-foreground"
                      >
                        +977-981621091
                      </a>
                      <a
                        href="tel:+9779811138552"
                        className="block text-sm text-muted-foreground hover:text-foreground"
                      >
                        +977-9811138552
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-sm text-muted-foreground">
                        Bhubaneswar, Odisha, India
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Serving clients worldwide
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Response Time</h3>
                      <p className="text-sm text-muted-foreground">
                        We typically respond within 24 hours.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
