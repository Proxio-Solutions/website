import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

const NAVBAR_OFFSET = -80;

let lenis: Lenis | null = null;

/** Starts Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/** Freezes page scrolling (e.g. while the mobile menu is open). */
export function setScrollLocked(locked: boolean) {
  document.body.style.overflow = locked ? 'hidden' : '';
  if (locked) lenis?.stop();
  else lenis?.start();
}

/** Scrolls to a y position or element, through Lenis when it is running. */
export function scrollToTarget(target: number | HTMLElement, { immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { immediate, offset: typeof target === 'number' ? 0 : NAVBAR_OFFSET });
    return;
  }
  const top =
    typeof target === 'number'
      ? target
      : target.getBoundingClientRect().top + window.scrollY + NAVBAR_OFFSET;
  window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' });
}
