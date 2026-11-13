/**
 * Articles for /insights, in both site languages. Bodies are simple blocks (paragraph,
 * subheading, list) so no Markdown parser ships to the browser. Add an article by adding an
 * entry here; the list, the article page and the reading time all follow from it.
 */

export type Block =
  { type: 'p'; text: string } | { type: 'h2'; text: string } | { type: 'ul'; items: string[] };

export interface ArticleCopy {
  title: string;
  excerpt: string;
  tag: string;
  body: Block[];
}

export interface Article {
  /** URL segment, the same in both languages: English, lowercase, kebab-case (see .claude/rules/urls.md). */
  slug: string;
  /** ISO date (YYYY-MM-DD) of publication. */
  date: string;
  /** ISO date of the last meaningful edit, when there has been one; feeds dateModified and the sitemap. */
  updated?: string;
  pt: ArticleCopy;
  en: ArticleCopy;
}

// Written by the team, never generated (see .claude/rules/content.md). While the list is empty
// the Articles section is hidden: no menu link, no route, no sitemap entry.
export const ARTICLES: Article[] = [];

/** Reading time at ~200 words a minute. */
export function readingMinutes(copy: ArticleCopy): number {
  const words = [
    copy.title,
    copy.excerpt,
    ...copy.body.flatMap((block) => (block.type === 'ul' ? block.items : [block.text])),
  ]
    .join(' ')
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function getArticle(slug: string | undefined): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

/** Long-form date in the reader's language, e.g. "11 de novembro de 2026". */
export function formatDate(date: string, language: string) {
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
}
