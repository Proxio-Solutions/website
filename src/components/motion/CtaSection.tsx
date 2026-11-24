import { gsap, motion, MOTION_OK, useGSAP } from '@/lib/gsap';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { Link } from '@components/LocalizedLink';
import DotGrid from './DotGrid';
import Magnetic from './Magnetic';
import SplitWords from './SplitWords';

interface CtaSectionProps {
  title: string;
  subtitle?: string;
  primary: { to: string; label: string };
  secondary?: { href: string; label: string };
}

/** Closing call-to-action shared by every page: dark panel, live dot grid, magnetic button. */
export default function CtaSection({ title, subtitle, primary, secondary }: CtaSectionProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({
            defaults: { ease: motion.ease.expo },
            scrollTrigger: { trigger: root.current, start: 'top 75%' },
          })
          // Scale only: fading the whole panel from 0 left a blank gap on phones until it ran
          .from('.cta-panel', { scale: 0.96, duration: motion.duration.slow })
          .from(
            '.split-word',
            { yPercent: 115, duration: motion.duration.normal, stagger: motion.stagger.normal },
            '<0.3',
          )
          .from(
            '.cta-fade',
            { y: motion.distance.sm, opacity: 0, duration: motion.duration.normal, stagger: 0.1 },
            '<0.3',
          );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="cta-panel bg-proxio-night relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 sm:py-20">
        <div className="cta-mask pointer-events-none absolute inset-0" aria-hidden="true">
          <DotGrid tone="dark" />
        </div>
        <div
          className="pointer-events-none absolute -top-1/2 left-1/2 h-full w-2/3 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--color-proxio-accent)_25%,transparent),transparent)]"
          aria-hidden="true"
        />

        <div className="relative">
          <h2 className="mx-auto max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            <SplitWords text={title} />
          </h2>
          {subtitle && (
            <p className="cta-fade mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/60">
              {subtitle}
            </p>
          )}
          <div className="cta-fade mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Magnetic className="w-full sm:w-auto">
              <Link
                viewTransition
                to={primary.to}
                className="group bg-proxio-accent hover:bg-proxio-accent-hover inline-flex w-full items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-colors sm:w-auto"
              >
                {primary.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            {secondary && (
              <a
                href={secondary.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 px-8 py-3.5 text-base font-bold text-white transition-colors hover:border-white/40 sm:w-auto"
              >
                {secondary.label}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
