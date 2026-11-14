interface SectionLabelProps {
  index?: string;
  children: string;
  className?: string;
}

/** Monospace "// 01 — Label" eyebrow; without an index it reads "// Label". */
export default function SectionLabel({ index, children, className = '' }: SectionLabelProps) {
  return (
    <span
      className={`text-proxio-accent inline-block font-mono text-xs font-medium tracking-[0.2em] uppercase ${className}`.trim()}
    >
      <span className="opacity-60">// {index ? `${index} — ` : ''}</span>
      {children}
    </span>
  );
}
