import { useState } from 'react';

/**
 * True while React hydrates the build-time HTML (see scripts/prerender.mjs).
 * That HTML is already on screen, so entrance animations must not hide it again.
 */
let hydrating = false;

export function startHydration() {
  hydrating = true;
}

/** Called once the first commit's effects ran; also drops the pre-hydration CSS hooks. */
export function endHydration() {
  if (!hydrating) return;
  hydrating = false;
  document.getElementById('root')?.removeAttribute('data-prerendered');
}

/** Whether this component first mounted on top of pre-rendered HTML (stable across re-renders). */
export function useMountedFromPrerender() {
  return useState(() => hydrating)[0];
}
