import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  languageFromPath,
  localizePath,
  stripLanguage,
  type Language,
} from '@/i18n/paths';
import { useLocation } from 'react-router-dom';

export const BASE_URL = 'https://proxiosolutions.com';
export const SITE_NAME = 'Proxio Solutions';
const OG_IMAGE = `${BASE_URL}/og-image.png`;
const OG_LOCALE: Record<Language, string> = { pt: 'pt_PT', en: 'en_GB' };

interface SEOProps {
  title: string;
  description: string;
  type?: string;
  /** Use the title as given, without the " | Proxio Solutions" suffix (the home page leads with the brand). */
  exactTitle?: boolean;
}

export default function SEO({
  title,
  description,
  type = 'website',
  exactTitle = false,
}: SEOProps) {
  const { pathname } = useLocation();
  const language = languageFromPath(pathname);
  const pageTitle = exactTitle ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${BASE_URL}${pathname}`;
  // The same page in each language, so search engines show the visitor's own
  const urlIn = (lang: Language) => `${BASE_URL}${localizePath(stripLanguage(pathname), lang)}`;

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {LANGUAGES.map((lang) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={urlIn(lang)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={urlIn(DEFAULT_LANGUAGE)} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={OG_LOCALE[language]} />
      <meta property="og:image" content={OG_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </>
  );
}
