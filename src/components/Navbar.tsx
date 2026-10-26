import bannerIllustration from '@assets/banner.svg';
import Magnetic from '@components/motion/Magnetic';
import { setScrollLocked } from '@/lib/smoothScroll';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { NAV_LINKS } from '../config/navigation';

const HIDE_AFTER = 160;

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [, setSearchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
    setSearchParams(
      (prev) => {
        prev.set('lang', newLang);
        return prev;
      },
      { replace: true },
    );
  };

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent page scroll when menu is open
  useEffect(() => {
    setScrollLocked(isMenuOpen);
    return () => setScrollLocked(false);
  }, [isMenuOpen]);

  // Glass background once scrolled, hide on scroll down / show on scroll up, reading progress
  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 8);
      if (Math.abs(y - lastY) > 4) setHidden(y > lastY && y > HIDE_AFTER);
      lastY = y;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  const isHidden = hidden && !isMenuOpen;

  return (
    <nav
      ref={menuRef}
      className={`sticky top-0 z-50 border-b transition-[translate,background-color,border-color,box-shadow] duration-500 ease-out motion-reduce:transition-none ${
        scrolled || isMenuOpen
          ? 'bg-proxio-darker/80 border-proxio-dark-border shadow-[0_8px_30px_-12px_rgb(15_23_42/0.12)] backdrop-blur-lg'
          : 'bg-proxio-darker border-transparent'
      } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center">
            <img
              src={bannerIllustration}
              alt="Proxio Solutions"
              className="h-10 w-auto opacity-90"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden space-x-6 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.translationKey}
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) =>
                  `nav-link relative px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-proxio-accent is-active'
                      : 'text-proxio-text-main hover:text-proxio-accent'
                  }`
                }
              >
                {t(link.translationKey)}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA + language toggle */}
          <div className="hidden items-center space-x-4 md:flex">
            <Magnetic strength={0.25}>
              <Link
                to="/contact"
                className="bg-proxio-accent hover:bg-proxio-accent-hover text-proxio-darker rounded-md px-5 py-2 text-sm font-bold transition-colors"
              >
                {t('nav.cta')}
              </Link>
            </Magnetic>

            <button
              onClick={toggleLanguage}
              className="text-proxio-text-muted hover:text-proxio-text-main font-mono text-xs font-medium uppercase transition-colors"
            >
              {i18n.language === 'pt' ? 'EN' : 'PT'}
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={isMenuOpen}
            className="text-proxio-text-main hover:text-proxio-accent flex items-center justify-center rounded-md p-2 transition-colors md:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Reading progress */}
      <div
        ref={progressRef}
        className="bg-proxio-accent absolute bottom-[-1px] left-0 h-[2px] w-full origin-left"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden="true"
      />

      {/* Mobile menu drawer */}
      <div
        className={`border-proxio-dark-border overflow-hidden border-t transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 border-transparent opacity-0'
        }`}
      >
        <div className="mx-auto max-w-7xl space-y-1 px-4 pt-3 pb-6 sm:px-6">
          {NAV_LINKS.map((link, i) => (
            <NavLink
              key={link.translationKey}
              to={link.href}
              end={link.href === '/'}
              onClick={() => setIsMenuOpen(false)}
              style={{ transitionDelay: isMenuOpen ? `${i * 40}ms` : '0ms' }}
              className={({ isActive }) =>
                `hover:bg-proxio-dark-border flex items-center gap-3 rounded-md px-4 py-3 text-base font-medium transition-[color,background-color,opacity,translate] duration-300 ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
                } ${isActive ? 'text-proxio-accent' : 'text-proxio-text-main hover:text-proxio-accent'}`
              }
            >
              <span className="text-proxio-text-muted font-mono text-xs">0{i + 1}</span>
              {t(link.translationKey)}
            </NavLink>
          ))}

          <div className="border-proxio-dark-border mt-4 flex items-center justify-between gap-4 border-t pt-4">
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="bg-proxio-accent hover:bg-proxio-accent-hover text-proxio-darker flex-1 rounded-md px-5 py-3 text-center text-sm font-bold transition-colors"
            >
              {t('nav.cta')}
            </Link>

            <button
              onClick={() => {
                toggleLanguage();
                setIsMenuOpen(false);
              }}
              className="text-proxio-text-muted hover:text-proxio-text-main border-proxio-dark-border rounded-md border px-4 py-3 font-mono text-sm font-medium uppercase transition-colors"
            >
              {i18n.language === 'pt' ? 'EN' : 'PT'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
