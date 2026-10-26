import { FINE_POINTER, gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { useRef, type ReactNode } from 'react';

interface MagneticProps {
  children: ReactNode;
  /** Share of the pointer offset the element follows (0–1). */
  strength?: number;
  className?: string;
}

/** Wraps a button or link so it leans towards the pointer and springs back on leave. */
export default function Magnetic({ children, strength = 0.3, className = '' }: MagneticProps) {
  const root = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const el = root.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

        const onMove = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
          yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
        };
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
        };

        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        return () => {
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerleave', onLeave);
        };
      });
    },
    { scope: root },
  );

  return (
    <span ref={root} className={`inline-flex ${className}`.trim()}>
      {children}
    </span>
  );
}
