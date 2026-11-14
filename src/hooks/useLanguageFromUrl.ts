import { languageFromPath } from '@/i18n/paths';
import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

/**
 * Keeps i18next on the language of the URL (`/en/...` is English, anything else Portuguese).
 * main.tsx sets it before the first render; this follows client-side navigation, before paint.
 */
export function useLanguageFromUrl() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const language = languageFromPath(pathname);

  useLayoutEffect(() => {
    if (i18n.resolvedLanguage !== language) void i18n.changeLanguage(language);
  }, [language, i18n]);
}
