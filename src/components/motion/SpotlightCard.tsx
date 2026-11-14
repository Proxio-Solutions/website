import type { HTMLAttributes, PointerEvent } from 'react';

/** Card with a soft accent light that follows the pointer (styles in `.spotlight`). */
export default function SpotlightCard({
  className = '',
  onPointerMove,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
    onPointerMove?.(e);
  };

  return (
    <div
      {...props}
      onPointerMove={handleMove}
      className={`spotlight card-lift relative ${className}`.trim()}
    />
  );
}
