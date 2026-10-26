import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** gsap.matchMedia condition for "animations allowed". */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** Pointer effects (magnetic, tilt) only make sense with a mouse. */
export const FINE_POINTER = '(hover: hover) and (pointer: fine)';

/** Shared motion tokens: every animation in the site pulls its timing from here. */
export const motion = {
  duration: { fast: 0.35, normal: 0.8, slow: 1 },
  ease: {
    out: 'power3.out',
    expo: 'power4.out',
    inOut: 'power2.inOut',
    pop: 'back.out(2)',
  },
  distance: { sm: 16, md: 40, lg: 48 },
  stagger: { tight: 0.05, normal: 0.08, loose: 0.12 },
} as const;

export { gsap, ScrollTrigger, useGSAP };
