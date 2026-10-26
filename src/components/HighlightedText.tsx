interface HighlightedTextProps {
  text: string;
  words: string[];
}

/** Hand-drawn underline placed under a highlighted phrase (parent must be `relative`). */
export function HighlightUnderline() {
  return (
    <svg
      aria-hidden="true"
      className="highlight-underline absolute -bottom-2 left-0 w-full overflow-visible"
      height="12"
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
    >
      <path
        d="M0,9 C8,5 18,11 32,7 C46,3 55,10 68,7 C80,4 90,10 100,8"
        fill="none"
        stroke="#4275f5"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
      />
      <path
        d="M2,11 C15,9 35,12 55,10 C75,8 88,11 100,10"
        fill="none"
        stroke="#4287f5"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.45"
        pathLength={1}
      />
    </svg>
  );
}

/** Splits `text` into plain and highlighted parts, longest highlight first. */
export function splitHighlights(text: string, words: string[]) {
  const pattern = [...words].sort((a, b) => b.length - a.length).join('|');
  return text
    .split(new RegExp(`(${pattern})`, 'g'))
    .filter(Boolean)
    .map((part) => ({ text: part, highlighted: words.includes(part) }));
}

export default function HighlightedText({ text, words }: HighlightedTextProps) {
  return (
    <>
      {splitHighlights(text, words).map((part, i) =>
        part.highlighted ? (
          <span key={i} className="relative inline-block whitespace-nowrap">
            {part.text}
            <HighlightUnderline />
          </span>
        ) : (
          part.text
        ),
      )}
    </>
  );
}
