import { gsap, motion, MOTION_OK, useGSAP } from '@/lib/gsap';
import { useRef, type ReactNode } from 'react';

/**
 * Enter transition for each route. Remount it with a `key` per pathname.
 * Transforms are cleared at the end: a lingering transform would break ScrollTrigger pins.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(root.current, {
          opacity: 0,
          y: motion.distance.sm,
          duration: motion.duration.fast * 1.5,
          ease: motion.ease.out,
          clearProps: 'opacity,transform',
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="flex flex-1 flex-col">
      {children}
    </div>
  );
}
