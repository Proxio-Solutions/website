import { Fragment } from 'react';

interface SplitWordsProps {
  text: string;
  /** Class put on each moving word, used as the animation target. */
  wordClassName?: string;
}

/** Wraps every word in a clipping mask so it can slide up into view. */
export default function SplitWords({ text, wordClassName = 'split-word' }: SplitWordsProps) {
  return (
    <>
      {text.split(/(\s+)/).map((word, i) =>
        /^\s+$/.test(word) ? (
          <Fragment key={i}> </Fragment>
        ) : word ? (
          <span
            key={i}
            className="-mb-[0.15em] inline-block overflow-hidden pb-[0.15em] align-bottom"
          >
            <span className={`${wordClassName} inline-block`}>{word}</span>
          </span>
        ) : null,
      )}
    </>
  );
}
