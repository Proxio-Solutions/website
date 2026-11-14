/**
 * The language lives in the URL: Portuguese (the default) has no prefix, English sits under /en.
 *
 *   /             <->  /en
 *   /about        <->  /en/about
 *   /services#web <->  /en/services#web
 *
 * Every page exists in both languages, so each one is pre-rendered twice (src/entry-server.tsx).
 */
export const LANGUAGES = ['pt', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'pt';
const EN_PREFIX = '/en';

const isEnglishPath = (pathname: string) =>
  pathname === EN_PREFIX || pathname.startsWith(`${EN_PREFIX}/`);

export const isLanguage = (value: unknown): value is Language =>
  LANGUAGES.includes(value as Language);

/** The language a pathname is in. */
export function languageFromPath(pathname: string): Language {
  return isEnglishPath(pathname) ? 'en' : DEFAULT_LANGUAGE;
}

/** The pathname without its language prefix: `/en/about` -> `/about`, `/en` -> `/`. */
export function stripLanguage(pathname: string): string {
  if (!isEnglishPath(pathname)) return pathname;
  return pathname.slice(EN_PREFIX.length) || '/';
}

/**
 * A site path (written in the code in its Portuguese form) in the given language.
 * Keeps any query or hash: `localizePath('/services#web', 'en')` -> `/en/services#web`.
 */
export function localizePath(path: string, language: Language): string {
  if (language === DEFAULT_LANGUAGE || !path.startsWith('/')) return path;
  // `/`, `/?q` and `/#id` become `/en`, `/en?q` and `/en#id`, not `/en/`
  return /^\/(?:[?#]|$)/.test(path) ? `${EN_PREFIX}${path.slice(1)}` : `${EN_PREFIX}${path}`;
}
