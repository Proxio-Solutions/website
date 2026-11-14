import { stripLanguage } from '@/i18n/paths';
import { scrollToTarget } from '@/lib/smoothScroll';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToHash() {
  const { hash, pathname: fullPathname } = useLocation();
  // Switching language (`/about` <-> `/en/about`) keeps the reader where they were
  const pathname = stripLanguage(fullPathname);

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

  return null;
}
