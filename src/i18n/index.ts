import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import ptTranslations from './locales/pt.json';
import { DEFAULT_LANGUAGE, languageFromPath } from './paths';

// Keep <html lang> in step with the page, for screen readers, hyphenation and search engines.
// Registered before init so the detected language is applied on the first load too.
i18n.on('languageChanged', () => {
  if (typeof document === 'undefined') return; // pre-rendering runs in Node
  document.documentElement.lang = i18n.resolvedLanguage ?? 'pt';
});

// The URL decides the language (src/i18n/paths.ts); App keeps i18n in step on navigation
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    pt: { translation: ptTranslations },
  },
  lng:
    typeof window === 'undefined' ? DEFAULT_LANGUAGE : languageFromPath(window.location.pathname),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
