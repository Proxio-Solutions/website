import { stripLanguage } from '@/i18n/paths';
import { releasePageAfterLanguageSwitch, scrollToTarget } from '@/lib/smoothScroll';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

export default function ScrollToHash() {
  const { hash, pathname: fullPathname } = useLocation();
  // Switching language (`/about` <-> `/en/about`) keeps the reader where they were
  const pathname = stripLanguage(fullPathname);
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage;

  useEffect(() => {
    if (!hash) {
      scrollToTarget(0, { immediate: true });
      return;
    }
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      scrollToTarget(el);
    } else {
      const timer = setTimeout(() => {
        const late = document.getElementById(id);
        if (late) scrollToTarget(late);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [hash, pathname]);

  // i18next switches after the URL does: wait for the new words (and their animations)
  // to be committed before letting the page resize
  useEffect(() => {
    releasePageAfterLanguageSwitch();
  }, [language]);

  return null;
}
