interface HighlightedTextProps {
  text: string;
  words: string[];
}

export default function HighlightedText({ text, words }: HighlightedTextProps) {
  const pattern = [...words].sort((a, b) => b.length - a.length).join('|');
  const parts = text.split(new RegExp(`(${pattern})`, 'g'));

  return (
    <>
      {parts.map((part, i) =>
        words.includes(part) ? (
          <span key={i} className="relative inline-block whitespace-nowrap">
            {part}
            <svg
              aria-hidden="true"
              className="absolute -bottom-2 left-0 w-full overflow-visible"
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
              />
              <path
                d="M2,11 C15,9 35,12 55,10 C75,8 88,11 100,10"
                fill="none"
                stroke="#4287f5"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeOpacity="0.45"
              />
            </svg>
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
