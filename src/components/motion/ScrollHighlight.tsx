import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { useRef } from 'react';

interface ScrollHighlightProps {
  text: string;
  className?: string;
}

/** Paragraph whose words light up one by one as it scrolls through the viewport. */
export default function ScrollHighlight({ text, className = '' }: ScrollHighlightProps) {
  const root = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          '.hl-word',
          // Dim enough to show progress, yet readable ahead of the scroll: 0.6 keeps the words
          // at 4.6:1 on the Mist background, which the 20px phone text needs
          { opacity: 0.6 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: {
              trigger: root.current,
              start: 'top 85%',
              end: 'bottom 55%',
              scrub: true,
            },
          },
        );
      });
    },
    { scope: root, dependencies: [text], revertOnUpdate: true },
  );

  return (
    <p ref={root} className={className}>
      {text.split(/(\s+)/).map((word, i) =>
        /^\s+$/.test(word) ? (
          word
        ) : (
          <span key={i} className="hl-word">
            {word}
          </span>
        ),
      )}
    </p>
  );
}
