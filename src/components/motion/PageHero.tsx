import { HighlightUnderline, splitHighlights } from '@components/motion/Highlight';
import { gsap, motion, MOTION_OK, useGSAP } from '@/lib/gsap';
import { useRef, type ReactNode } from 'react';
import DotGrid from './DotGrid';
import SectionLabel from './SectionLabel';
import SplitWords from './SplitWords';

interface PageHeroProps {
  title: string;
  highlights?: string[];
  /** Mono eyebrow above the title. */
  label?: string;
  /** Pill with a live dot and blinking caret (Home). */
  badge?: string;
  subtitle?: string;
  align?: 'center' | 'left';
  size?: 'lg' | 'xl';
  fullHeight?: boolean;
  /** Rendered above the eyebrow, outside the entrance animation (e.g. a back link). */
  before?: ReactNode;
  /** Actions or extra content below the subtitle; fades in last. */
  children?: ReactNode;
}

const titleSizes = {
  lg: 'text-4xl sm:text-5xl lg:text-6xl',
  xl: 'text-4xl min-[440px]:text-5xl sm:text-6xl lg:text-7xl',
};

/**
 * Shared page hero: interactive dot grid, word-by-word title,
 * hand-drawn underline on highlighted phrases, then the rest fades in.
 */
export default function PageHero({
  title,
  highlights = [],
  label,
  badge,
  subtitle,
  align = 'center',
  size = 'lg',
  fullHeight = false,
  before,
  children,
}: PageHeroProps) {
  const root = useRef<HTMLElement>(null);
  const centered = align === 'center';
  const parts = highlights.length
    ? splitHighlights(title, highlights)
    : [{ text: title, highlighted: false }];

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: motion.ease.expo } })
          .from('.hero-fade-top', {
            y: motion.distance.sm,
            opacity: 0,
            duration: motion.duration.normal,
          })
          .from(
            '.hero-word',
            { yPercent: 115, duration: motion.duration.slow, stagger: motion.stagger.normal },
            '<0.1',
          )
          .fromTo(
            '.highlight-underline path',
            { strokeDasharray: 1, strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: motion.duration.normal,
              stagger: 0.15,
              ease: motion.ease.inOut,
            },
            '-=0.4',
          )
          .from(
            '.hero-fade',
            { y: 24, opacity: 0, duration: motion.duration.normal, stagger: motion.stagger.loose },
            '<0.1',
          );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden">
      <div className="hero-mask pointer-events-none absolute inset-0" aria-hidden="true">
        <DotGrid />
      </div>
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div
        className={`relative mx-auto flex max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8 ${
          fullHeight ? 'min-h-[calc(100svh-4rem)] py-24' : 'py-24 lg:py-32'
        } ${centered ? 'items-center' : ''}`}
      >
        {before}
        <div className={centered ? 'mx-auto max-w-4xl text-center' : 'max-w-4xl'}>
          {badge && (
            <span className="hero-fade-top bg-proxio-darker/80 border-proxio-dark-border text-proxio-text-muted inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 font-mono text-xs font-medium shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="bg-proxio-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
                <span className="bg-proxio-accent relative inline-flex h-2 w-2 rounded-full" />
              </span>
              {badge}
              <span className="caret text-proxio-accent -ml-1.5" aria-hidden="true">
                _
              </span>
            </span>
          )}
          {label && <SectionLabel className="hero-fade-top">{label}</SectionLabel>}

          <h1
            className={`text-proxio-text-main mt-6 leading-[1.08] font-extrabold tracking-tight ${titleSizes[size]}`}
          >
            {parts.map((part, i) =>
              part.highlighted ? (
                <span key={i} className="relative inline-block whitespace-nowrap">
                  <SplitWords text={part.text} wordClassName="hero-word" />
                  <HighlightUnderline />
                </span>
              ) : (
                <SplitWords key={i} text={part.text} wordClassName="hero-word" />
              ),
            )}
          </h1>

          {subtitle && (
            <p
              className={`hero-fade text-proxio-text-muted mt-8 max-w-2xl text-xl leading-relaxed ${centered ? 'mx-auto' : ''}`}
            >
              {subtitle}
            </p>
          )}

          {children && <div className="hero-fade mt-10">{children}</div>}
        </div>
      </div>
    </section>
  );
}
