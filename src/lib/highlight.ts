/** Splits `text` into plain and highlighted parts, longest highlight first. */
export function splitHighlights(text: string, words: string[]) {
  const pattern = [...words].sort((a, b) => b.length - a.length).join('|');
  return text
    .split(new RegExp(`(${pattern})`, 'g'))
    .filter(Boolean)
    .map((part) => ({ text: part, highlighted: words.includes(part) }));
}
