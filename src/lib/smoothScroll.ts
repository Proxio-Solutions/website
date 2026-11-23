import Lenis from 'lenis';
import type { MouseEvent } from 'react';
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
  // Without this, GSAP "catches up" after a slow frame and the page visibly jumps
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    gsap.ticker.lagSmoothing(500, 33);
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

/*
 * Switching language keeps the page mounted and swaps its words, which rebuilds the
 * ScrollTriggers of the headings. Each new trigger measures itself with the pinned sections'
 * spacing briefly removed: the page gets shorter, the browser clamps the scroll position and
 * the reader is thrown up the page. Holding the page height through the switch prevents it.
 */
let scrollBeforeLanguageSwitch: number | null = null;

/** Called by the language links, right before the page's words change. */
export function holdPageForLanguageSwitch(event: MouseEvent) {
  // A modified click opens the other language in a new tab: this page stays as it is
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
    return;
  scrollBeforeLanguageSwitch = window.scrollY;
  document.body.style.minHeight = `${document.documentElement.scrollHeight}px`;
}

/** Called once the new language is committed: lets the page resize and re-measures. */
export function releasePageAfterLanguageSwitch() {
  if (scrollBeforeLanguageSwitch === null) return;
  const y = scrollBeforeLanguageSwitch;
  scrollBeforeLanguageSwitch = null;
  requestAnimationFrame(() => {
    document.body.style.minHeight = '';
    ScrollTrigger.refresh();
    // Native, not lenis.scrollTo: Lenis would skip a target it believes it is already at
    if (Math.abs(window.scrollY - y) > 1) window.scrollTo({ top: y, behavior: 'instant' });
  });
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
