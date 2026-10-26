import { useEffect, useRef } from 'react';

const SPACING = 26;
const BASE_RADIUS = 1.1;
const HOVER_RADIUS = 150;
const MAX_PUSH = 10;

/**
 * Canvas dot grid that swells and turns accent-blue around the pointer,
 * with a slow ambient wave so it stays alive on touch devices.
 */
export default function DotGrid({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      smooth.x += (pointer.x - smooth.x) * 0.12;
      smooth.y += (pointer.y - smooth.y) * 0.12;

      for (let x = SPACING / 2; x < width; x += SPACING) {
        for (let y = SPACING / 2; y < height; y += SPACING) {
          const dx = x - smooth.x;
          const dy = y - smooth.y;
          const dist = Math.hypot(dx, dy);
          const near = Math.max(0, 1 - dist / HOVER_RADIUS);
          const wave = reduceMotion ? 0 : (Math.sin(x * 0.012 + y * 0.008 - time * 0.0012) + 1) / 2;

          const push = near * near * MAX_PUSH;
          const px = dist > 0 ? x + (dx / dist) * push : x;
          const py = dist > 0 ? y + (dy / dist) * push : y;
          const radius = BASE_RADIUS + near * 1.8 + wave * 0.35;

          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fillStyle =
            near > 0.02
              ? `rgba(37, 99, 235, ${0.25 + near * 0.65})`
              : `rgba(15, 23, 42, ${0.1 + wave * 0.08})`;
          ctx.fill();
        }
      }
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
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true" className={`h-full w-full ${className}`.trim()} />
  );
}
