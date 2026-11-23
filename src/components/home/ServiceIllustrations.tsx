/* Line illustrations: `svc-draw` strokes are drawn in on scroll, `svc-pop` shapes pop in. */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  pathLength: 1,
} as const;

export function WebIllustration() {
  return (
    <svg viewBox="0 0 200 130" className="h-full w-full">
      <g className="text-slate-300">
        <rect className="svc-draw" x="20" y="12" width="160" height="106" rx="8" {...stroke} />
        <path className="svc-draw" d="M20 30H180" {...stroke} />
        <path className="svc-draw" d="M34 60H120M34 68H100" {...stroke} />
        <rect className="svc-draw" x="34" y="82" width="38" height="24" rx="3" {...stroke} />
        <rect className="svc-draw" x="130" y="82" width="38" height="24" rx="3" {...stroke} />
      </g>
      <g className="text-proxio-accent">
        {[31, 39, 47].map((cx) => (
          <circle key={cx} className="svc-pop" cx={cx} cy="21" r="2.2" fill="currentColor" />
        ))}
        <rect
          className="svc-pop svc-bar"
          x="34"
          y="42"
          width="70"
          height="9"
          rx="2"
          fill="currentColor"
        />
        <rect className="svc-draw" x="82" y="82" width="38" height="24" rx="3" {...stroke} />
      </g>
    </svg>
  );
}

export function MobileIllustration() {
  return (
    <svg viewBox="0 0 200 130" className="h-full w-full">
      <g className="text-slate-300">
        <rect className="svc-draw" x="72" y="8" width="56" height="114" rx="10" {...stroke} />
        <path className="svc-draw" d="M93 16H107" {...stroke} />
        <path className="svc-draw" d="M82 60H118M82 68H108" {...stroke} />
      </g>
      <g className="text-proxio-accent">
        <rect className="svc-pop" x="82" y="28" width="36" height="22" rx="3" fill="currentColor" />
        <rect className="svc-draw" x="82" y="98" width="36" height="12" rx="4" {...stroke} />
        <path
          className="svc-draw svc-wave"
          d="M60 52Q52 65 60 78M140 52Q148 65 140 78"
          {...stroke}
        />
        <path
          className="svc-draw svc-wave svc-wave-2"
          d="M50 44Q38 65 50 86M150 44Q162 65 150 86"
          {...stroke}
        />
      </g>
    </svg>
  );
}

const satellites = [
  [40, 30],
  [160, 30],
  [28, 96],
  [172, 96],
  [100, 14],
  [100, 116],
] as const;

export function ConsultingIllustration() {
  return (
    <svg viewBox="0 0 200 130" className="h-full w-full">
      <g className="text-slate-300">
        {satellites.map(([x, y]) => (
          <path key={`l${x}${y}`} className="svc-draw" d={`M100 65L${x} ${y}`} {...stroke} />
        ))}
        {satellites.map(([x, y]) => (
          <circle
            key={`c${x}${y}`}
            className="svc-pop svc-node"
            cx={x}
            cy={y}
            r="6"
            fill="white"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
      </g>
      <g className="text-proxio-accent">
        <circle
          className="svc-ring"
          cx="100"
          cy="65"
          r="17"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.35"
        />
        <circle className="svc-pop" cx="100" cy="65" r="10" fill="currentColor" />
      </g>
    </svg>
  );
}
