import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-secondary py-24 md:py-32">
      <div
        className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black, black)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black, black)',
        }}
      ></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Business and IT Solutions for a
          <span className="block text-primary">Dynamic World</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          Zensolve Infotech empowers businesses with IT consulting, placement services, and tailored business solutions.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="#contact">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#services">Our Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
