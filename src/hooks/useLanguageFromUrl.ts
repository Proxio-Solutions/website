import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGS = ['pt', 'en'];

export function useLanguageFromUrl() {
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = searchParams.get('lang');
    if (lang && SUPPORTED_LANGS.includes(lang) && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [searchParams]);
}