import { gsap, motion, MOTION_OK, useGSAP } from '@/lib/gsap';
import { useMountedFromPrerender } from '@/lib/hydration';
import { useRef, type ReactNode } from 'react';
import { useNavigationType } from 'react-router-dom';

const supportsViewTransitions =
  typeof document !== 'undefined' && 'startViewTransition' in document;

/**
 * Enter transition for each route. Remount it with a `key` per pathname.
 * Link navigations animate through the View Transitions API (see index.css), so this
 * only runs for the first load, back/forward and browsers without that API.
 * A first load on pre-rendered HTML skips it too: that content is already painted.
 * Transforms are cleared at the end: a lingering transform would break ScrollTrigger pins.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const navigationType = useNavigationType();
  const handledByViewTransition = supportsViewTransitions && navigationType !== 'POP';
  const alreadyPainted = useMountedFromPrerender();

  useGSAP(
    () => {
      if (handledByViewTransition || alreadyPainted) return;
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
