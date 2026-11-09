import { useEffect, useRef } from 'react';

const SPACING = 26;
const BASE_RADIUS = 1.1;
const HOVER_RADIUS = 150;
const MAX_PUSH = 10;
const WAVE_BUCKETS = 8;

/** [r, g, b, base alpha] for idle dots and [r, g, b] for dots near the pointer. */
const TONES = {
  light: { idle: [15, 23, 42, 0.1], near: [37, 99, 235] },
  dark: { idle: [255, 255, 255, 0.07], near: [96, 165, 250] },
} as const;

interface DotGridProps {
  className?: string;
  tone?: keyof typeof TONES;
}

/**
 * Canvas dot grid that swells and turns accent-blue around the pointer,
 * with a slow ambient wave so it stays alive on touch devices.
 */
export default function DotGrid({ className = '', tone = 'light' }: DotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const { idle, near: nearRgb } = TONES[tone];
    const pointer = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    // Idle dots are batched into a few alpha buckets (one fill each) instead of one fill per dot
    const idleStyles = Array.from(
      { length: WAVE_BUCKETS },
      (_, b) =>
        `rgba(${idle[0]}, ${idle[1]}, ${idle[2]}, ${idle[3] + ((b + 0.5) / WAVE_BUCKETS) * 0.08})`,
    );

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      smooth.x += (pointer.x - smooth.x) * 0.12;
      smooth.y += (pointer.y - smooth.y) * 0.12;

      const buckets = idleStyles.map(() => new Path2D());
      const hoverSq = HOVER_RADIUS * HOVER_RADIUS;

      for (let x = SPACING / 2; x < width; x += SPACING) {
        for (let y = SPACING / 2; y < height; y += SPACING) {
          const wave = reduceMotion ? 0 : (Math.sin(x * 0.012 + y * 0.008 - time * 0.0012) + 1) / 2;
          const dx = x - smooth.x;
          const dy = y - smooth.y;
          const distSq = dx * dx + dy * dy;

          if (distSq >= hoverSq) {
            const radius = BASE_RADIUS + wave * 0.35;
            const path = buckets[Math.min(WAVE_BUCKETS - 1, Math.floor(wave * WAVE_BUCKETS))];
            path.moveTo(x + radius, y);
            path.arc(x, y, radius, 0, Math.PI * 2);
            continue;
          }

          const dist = Math.sqrt(distSq);
          const near = 1 - dist / HOVER_RADIUS;
          const push = near * near * MAX_PUSH;
          const px = dist > 0 ? x + (dx / dist) * push : x;
          const py = dist > 0 ? y + (dy / dist) * push : y;

          ctx.beginPath();
          ctx.arc(px, py, BASE_RADIUS + near * 1.8 + wave * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${nearRgb[0]}, ${nearRgb[1]}, ${nearRgb[2]}, ${0.25 + near * 0.65})`;
          ctx.fill();
        }
      }

      buckets.forEach((path, b) => {
        ctx.fillStyle = idleStyles[b];
        ctx.fill(path);
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduceMotion) draw(0);
    };

    const loop = (time: number) => {
      if (visible) draw(time);
      frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      if (smooth.x < -999) {
        smooth.x = pointer.x;
        smooth.y = pointer.y;
      }
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    if (reduceMotion) return () => resizeObserver.disconnect();

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibilityObserver.observe(canvas);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [tone]);

  return (
    <canvas ref={canvasRef} aria-hidden="true" className={`h-full w-full ${className}`.trim()} />
  );
}
