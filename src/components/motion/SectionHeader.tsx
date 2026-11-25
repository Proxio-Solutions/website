import { gsap, motion, MOTION_OK, useGSAP } from '@/lib/gsap';
import { useRef } from 'react';
import SectionLabel from './SectionLabel';
import SplitWords from './SplitWords';

interface SectionHeaderProps {
  index?: string;
  label: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  tone?: 'light' | 'dark';
  className?: string;
}

/** Section eyebrow + title whose words rise into view on scroll. */
export default function SectionHeader({
  index,
  label,
  title,
  subtitle,
  align = 'left',
  tone = 'light',
  className = 'mb-14',
}: SectionHeaderProps) {
  const root = useRef<HTMLDivElement>(null);
  // Set once the entrance has started, so a language switch never hides the heading again
  const revealed = useRef(false);
  const centered = align === 'center';
  const dark = tone === 'dark';

  useGSAP(
    () => {
      if (revealed.current) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap
          .timeline({
            defaults: { ease: motion.ease.expo },
            scrollTrigger: { trigger: root.current, start: 'top 92%' },
            onStart: () => {
              revealed.current = true;
            },
          })
          .from('.section-label', { opacity: 0, y: 12, duration: motion.duration.fast })
          .from(
            '.split-word',
            { yPercent: 115, duration: motion.duration.normal, stagger: motion.stagger.tight },
            '<0.05',
          );
        // The subtitle is optional; tweening a missing target makes GSAP warn
        if (subtitle) {
          tl.from(
            '.section-sub',
            { opacity: 0, y: motion.distance.sm, duration: motion.duration.normal },
            '<0.2',
          );
        }
      });
    },
    // Switching language keeps the page mounted but swaps the words: revert the old timeline
    // (and its hidden from-state), then animate the new words only if the heading was not
    // revealed yet
    { scope: root, dependencies: [title, subtitle], revertOnUpdate: true },
  );

  return (
    <div
      ref={root}
      className={`${centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`.trim()}
    >
      <SectionLabel index={index} className={`section-label ${dark ? '!text-blue-400' : ''}`}>
        {label}
      </SectionLabel>
      <h2
        className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl ${dark ? 'text-white' : 'text-proxio-text-main'}`}
      >
        <SplitWords text={title} />
      </h2>
      {subtitle && (
        <p
          className={`section-sub mt-4 text-lg leading-relaxed ${dark ? 'text-white/60' : 'text-proxio-text-muted'}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
