import Footer from '@components/Footer';
import PageTransition from '@components/motion/PageTransition';
import Navbar from '@components/Navbar';
import ScrollToHash from '@components/ScrollToHash';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useLanguageFromUrl } from './hooks/useLanguageFromUrl';
import { endHydration } from './lib/hydration';
import { startSmoothScroll } from './lib/smoothScroll';

export default function App() {
  useLanguageFromUrl();
  const { pathname } = useLocation();

  useEffect(() => startSmoothScroll(), []);
  // Runs after every child's layout effects of the first commit (the hydration pass)
  useEffect(() => endHydration(), []);

  return (
    <div className="bg-proxio-darker text-proxio-text-main flex min-h-screen flex-col">
      <ScrollToHash />
      <Navbar />

      <div className="flex flex-1 flex-col">
        <PageTransition key={pathname}>
          <Outlet />
        </PageTransition>
      </div>

      <Footer />
    </div>
  );
}
