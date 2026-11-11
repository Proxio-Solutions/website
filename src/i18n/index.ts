import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import ptTranslations from './locales/pt.json';

// Keep <html lang> in step with the page, for screen readers, hyphenation and search engines.
// Registered before init so the detected language is applied on the first load too.
i18n.on('languageChanged', () => {
  if (typeof document === 'undefined') return; // pre-rendering runs in Node
  document.documentElement.lang = i18n.resolvedLanguage ?? 'pt';
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      pt: { translation: ptTranslations },
    },
    fallbackLng: 'pt',
    detection: {
      order: ['querystring', 'localStorage'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
