import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/40 py-20 sm:py-28 lg:py-36">
      {/* Dynamic Background Glow & Grid Elements */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-mask opacity-60" />
      
      {/* Ambient Gradient Orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[550px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/30 via-sky-400/20 to-purple-600/30 blur-3xl opacity-60 animate-pulse-glow" />
      <div className="pointer-events-none absolute top-1/2 right-0 -z-10 h-[350px] w-[350px] rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          
          {/* Hero Headline */}
          <h1 className="max-w-5xl text-balance text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.1]">
            We Build{' '}
            <span className="relative inline-block">
              <span className="text-gradient-animated">Production-Grade</span>
              <span className="absolute -bottom-1.5 left-0 right-0 h-1.5 rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-600 blur-sm opacity-80" />
            </span>{' '}
            Apps That Scale Effortlessly
          </h1>

          {/* Hero Subtitle */}
          <p className="mt-6 max-w-3xl text-balance text-lg sm:text-xl leading-relaxed text-muted-foreground/90 font-normal">
            Turn your complex project requirements into{' '}
            <strong className="font-semibold text-foreground">elegant</strong>,{' '}
            <strong className="font-semibold text-foreground">resilient</strong>, and{' '}
            <strong className="font-semibold text-foreground">ultra-fast</strong> web &amp; mobile applications. Explore our portfolio or post your custom requirement today.
          </p>

          {/* CTA Action Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row w-full sm:w-auto">
            {/* Primary Button with Glowing Halo */}
            <div className="relative group w-full sm:w-auto">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 opacity-70 blur transition-all duration-300 group-hover:opacity-100 group-hover:blur-md" />
              <Button
                asChild
                size="lg"
                className="relative h-14 w-full sm:w-auto px-8 text-base font-semibold shadow-xl transition-all duration-300 group-hover:scale-[1.02] active:scale-[0.98]"
              >
                <Link href="/post-a-job" className="flex items-center justify-center gap-2">
                  <span>Post Requirement</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Secondary Glass Button */}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 w-full sm:w-auto px-8 text-base font-semibold border-border/80 bg-background/60 backdrop-blur-md transition-all duration-300 hover:bg-accent/80 hover:border-primary/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link href="/projects" className="flex items-center justify-center gap-2">
                <Play className="h-4 w-4 text-primary fill-primary/20" />
                <span>View Our Work</span>
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
