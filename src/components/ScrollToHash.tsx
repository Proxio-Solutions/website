import { scrollToTarget } from '@/lib/smoothScroll';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToHash() {
  const { hash, pathname } = useLocation();

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
