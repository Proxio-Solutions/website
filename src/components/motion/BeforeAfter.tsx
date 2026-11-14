import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { ChevronsLeftRight } from 'lucide-react';
import {
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';

interface BeforeAfterProps {
  before: ReactNode;
  after: ReactNode;
  beforeLabel: string;
  afterLabel: string;
  /** Accessible name of the slider handle. */
  handleLabel: string;
  /** Where the split rests, in % from the left. */
  initial?: number;
  className?: string;
}

const clamp = (value: number) => Math.min(100, Math.max(0, value));

/**
 * Drag-to-compare panel: "before" sits on top, clipped at the handle; "after" shows beneath.
 * The split lives in a CSS variable, so dragging never re-renders React.
 * The handle is a keyboard slider, and a short sway on first view hints that it moves.
 */
export default function BeforeAfter({
  before,
  after,
  beforeLabel,
  afterLabel,
  handleLabel,
  initial = 50,
  className = '',
}: BeforeAfterProps) {
  const root = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const hint = useRef<gsap.core.Tween | null>(null);
  const position = useRef({ value: initial });

  const setPosition = (value: number) => {
    position.current.value = clamp(value);
    root.current?.style.setProperty('--split', `${position.current.value}%`);
    handle.current?.setAttribute('aria-valuenow', String(Math.round(position.current.value)));
  };

  const stopHint = () => {
    hint.current?.kill();
    hint.current = null;
  };

  const fromPointer = (clientX: number) => {
    const rect = root.current?.getBoundingClientRect();
    if (rect) setPosition(((clientX - rect.left) / rect.width) * 100);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    stopHint();
    e.currentTarget.setPointerCapture(e.pointerId);
    fromPointer(e.clientX);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e.clientX);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowLeft: position.current.value - 5,
      ArrowRight: position.current.value + 5,
      Home: 0,
      End: 100,
    };
    if (!(e.key in steps)) return;
    e.preventDefault();
    stopHint();
    setPosition(steps[e.key]);
  };

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 70%',
          once: true,
          onEnter: () => {
            hint.current = gsap.to(position.current, {
              keyframes: { value: [initial, initial - 16, initial + 18, initial] },
              duration: 2.2,
              ease: 'power1.inOut',
              onUpdate: () => setPosition(position.current.value),
            });
          },
        });
        return stopHint;
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      className={`relative cursor-ew-resize touch-pan-y overflow-hidden rounded-3xl select-none ${className}`}
      style={{ '--split': `${initial}%` } as CSSProperties}
    >
      <div className="absolute inset-0" aria-hidden="true">
        {after}
      </div>
      <div
        className="absolute inset-0 [clip-path:inset(0_calc(100%-var(--split))_0_0)]"
        aria-hidden="true"
      >
        {before}
      </div>

      <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-slate-900/80 px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-white uppercase">
        {beforeLabel}
      </span>
      <span className="bg-proxio-accent pointer-events-none absolute top-4 right-4 rounded-full px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-white uppercase">
        {afterLabel}
      </span>

      {/* Divider + handle */}
      <div className="pointer-events-none absolute inset-y-0 left-[var(--split)] w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(15_23_42/0.08)]" />
      <div
        ref={handle}
        role="slider"
        tabIndex={0}
        aria-label={handleLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={initial}
        onKeyDown={onKeyDown}
        className="focus-visible:ring-proxio-accent text-proxio-text-main absolute top-1/2 left-[var(--split)] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg ring-1 shadow-slate-900/20 ring-slate-900/10 outline-none focus-visible:ring-2"
      >
        <ChevronsLeftRight className="h-5 w-5" />
      </div>
    </div>
  );
}
