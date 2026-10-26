import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useRef } from 'react';

interface CountUpProps {
  /** "240+", "13", or any text; only a leading number counts up, the rest is the suffix. */
  value: string;
  suffixClassName?: string;
}

/** Counts a leading number up from zero the first time it scrolls into view. */
export default function CountUp({ value, suffixClassName = '' }: CountUpProps) {
  const numberRef = useRef<HTMLSpanElement>(null);
  const match = value.match(/^(\d+)(.*)$/);

  useGSAP(
    () => {
      if (!match) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        const el = numberRef.current;
        if (!el) return;
        // The final number stays rendered until the count starts, so it never sits at 0
        ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          once: true,
          onEnter: () => {
            const counter = { value: 0 };
            gsap.to(counter, {
              value: Number(match[1]),
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = Math.round(counter.value).toString();
              },
            });
          },
        });
      });
    },
    { dependencies: [value] },
  );

  if (!match) return <>{value}</>;
  return (
    <>
      <span ref={numberRef} className="tabular-nums">
        {match[1]}
      </span>
      {match[2] && <span className={suffixClassName}>{match[2]}</span>}
    </>
  );
}
