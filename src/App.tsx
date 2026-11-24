import Footer from '@components/Footer';
import PageTransition from '@components/motion/PageTransition';
import Navbar from '@components/Navbar';
import ScrollToHash from '@components/ScrollToHash';
import { stripLanguage } from '@/i18n/paths';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router-dom';
import { useLanguageFromUrl } from './hooks/useLanguageFromUrl';
import { endHydration } from './lib/hydration';
import { startSmoothScroll } from './lib/smoothScroll';

export default function App() {
  useLanguageFromUrl();
  const { t } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => startSmoothScroll(), []);
  // Runs after every child's layout effects of the first commit (the hydration pass)
  useEffect(() => endHydration(), []);

  return (
    <div className="bg-proxio-darker text-proxio-text-main flex min-h-screen flex-col">
      <ScrollToHash />
      {/* Keyboard users can jump past the menu; invisible until it takes focus */}
      <a
        href="#content"
        className="bg-proxio-accent sr-only z-[100] rounded-lg text-sm font-bold text-white shadow-lg focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:px-4 focus:py-2"
      >
        {t('nav.skipToContent')}
      </a>
      <Navbar />

      <div id="content" tabIndex={-1} className="flex flex-1 flex-col outline-none">
        {/* Switching language keeps the page in place: only a new page plays the transition */}
        <PageTransition key={stripLanguage(pathname)}>
          <Outlet />
        </PageTransition>
      </div>

      <Footer />
    </div>
  );
}
