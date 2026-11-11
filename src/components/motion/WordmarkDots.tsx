import { useEffect, useRef } from 'react';

const WORD = 'Proxio';
const FONT = '"Plus Jakarta Sans", sans-serif';
const HOVER_RADIUS = 120;
const MAX_PUSH = 8;
const REVEAL_MS = 1400;

/** [r, g, b, alpha] of a resting dot, and [r, g, b] of a dot near the pointer. */
const IDLE = [15, 23, 42, 0.16] as const;
const NEAR = [37, 99, 235] as const;

interface Dot {
  x: number;
  y: number;
}

/**
 * The brand word drawn as a field of dots, in the same language as the hero grid.
 * Dots sweep in from the left the first time it scrolls into view and swell towards
 * the pointer. It only redraws while something moves; otherwise the canvas sits still.
 */
export default function WordmarkDots({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let radius = 2;
    let frame = 0;
    let revealStart = reduceMotion ? -Infinity : Infinity;
    let revealed = reduceMotion;
    let cancelled = false;

    /** Rasterises the word off-screen and keeps one dot per filled grid cell. */
    const sample = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const octx = off.getContext('2d', { willReadFrequently: true });
      if (!octx || !width || !height) return;

      // Fit the word inside the box (whichever of width or height runs out first), centred
      octx.font = `800 100px ${FONT}`;
      const metrics = octx.measureText(WORD);
      const fontSize = Math.min(
        (100 * width * 0.98) / metrics.width,
        (100 * height * 0.92) / metrics.actualBoundingBoxAscent,
      );
      octx.font = `800 ${fontSize}px ${FONT}`;
      octx.textAlign = 'center';
      octx.textBaseline = 'alphabetic';
      octx.fillText(
        WORD,
        width / 2,
        (height + (metrics.actualBoundingBoxAscent * fontSize) / 100) / 2,
      );

      // Dot pitch follows the letter size so small and large words read the same
      const spacing = Math.max(4, Math.min(9, Math.round(fontSize / 22)));
      radius = spacing * 0.34;

      const data = octx.getImageData(0, 0, width, height).data;
      dots = [];
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          if (data[(Math.floor(y) * width + Math.floor(x)) * 4 + 3] > 128) dots.push({ x, y });
        }
      }
    };

    /** Draws one frame; returns whether another frame is needed. */
    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      smooth.x += (pointer.x - smooth.x) * 0.15;
      smooth.y += (pointer.y - smooth.y) * 0.15;

      const elapsed = time - revealStart;
      const idle = new Path2D();
      const hoverSq = HOVER_RADIUS * HOVER_RADIUS;
      let revealing = false;

      for (const dot of dots) {
        // Sweep in from left to right on first view
        const delay = (dot.x / width) * (REVEAL_MS * 0.55);
        const t = Math.min(1, Math.max(0, (elapsed - delay) / (REVEAL_MS * 0.45)));
        if (t < 1) revealing = true;
        if (t === 0) continue;
        const scale = 1 - (1 - t) ** 3;

        const dx = dot.x - smooth.x;
        const dy = dot.y - smooth.y;
        const distSq = dx * dx + dy * dy;

        if (distSq >= hoverSq || scale < 1) {
          const r = radius * scale;
          idle.moveTo(dot.x + r, dot.y);
          idle.arc(dot.x, dot.y, r, 0, Math.PI * 2);
          continue;
        }

        const dist = Math.sqrt(distSq);
        const near = 1 - dist / HOVER_RADIUS;
        const push = near * near * MAX_PUSH;
        const px = dist > 0 ? dot.x + (dx / dist) * push : dot.x;
        const py = dist > 0 ? dot.y + (dy / dist) * push : dot.y;
        ctx.beginPath();
        ctx.arc(px, py, radius * (1 + near * 0.9), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${NEAR[0]}, ${NEAR[1]}, ${NEAR[2]}, ${0.35 + near * 0.65})`;
        ctx.fill();
      }

      ctx.fillStyle = `rgba(${IDLE[0]}, ${IDLE[1]}, ${IDLE[2]}, ${IDLE[3]})`;
      ctx.fill(idle);

      const settling = Math.abs(pointer.x - smooth.x) > 0.5 || Math.abs(pointer.y - smooth.y) > 0.5;
      return (revealed && revealing) || settling;
    };

    // Runs only while the reveal plays or the pointer smoothing has not settled
    const loop = (time: number) => {
      frame = 0;
      if (draw(time)) frame = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      if (smooth.x < -999) {
        smooth.x = pointer.x;
        smooth.y = pointer.y;
      }
      kick();
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      smooth.x = -9999;
      smooth.y = -9999;
      kick();
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!revealed) {
            revealed = true;
            revealStart = performance.now();
          }
          if (!reduceMotion) {
            canvas.addEventListener('pointermove', onPointerMove, { passive: true });
            canvas.addEventListener('pointerleave', onPointerLeave);
          }
          kick();
        } else {
          canvas.removeEventListener('pointermove', onPointerMove);
          canvas.removeEventListener('pointerleave', onPointerLeave);
        }
      },
      { threshold: 0.25 },
    );

    const resizeObserver = new ResizeObserver(() => {
      sample();
      draw(performance.now());
    });

    // Wait for the brand font so the word is not sampled in the fallback face
    document.fonts.load(`800 100px ${FONT}`).finally(() => {
      if (cancelled) return;
      resizeObserver.observe(canvas);
      visibilityObserver.observe(canvas);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full ${className}`.trim()}
    />
  );
}
