import bannerIllustration from '@assets/banner.svg';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { NAV_LINKS } from '../config/navigation';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [, setSearchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
    setSearchParams((prev) => { prev.set('lang', newLang); return prev; }, { replace: true });
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

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <nav className="bg-proxio-dark border-proxio-dark-border relative z-50 border-b shadow-lg" ref={menuRef}>
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
          <div className="hidden space-x-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.translationKey}
                to={link.href}
                className="text-proxio-text-main hover:text-proxio-accent px-3 py-2 text-sm font-medium transition-colors"
              >
                {t(link.translationKey)}
              </Link>
            ))}
          </div>

          {/* Desktop CTA + language toggle */}
          <div className="hidden items-center space-x-4 md:flex">
            <Link
              to="/contact"
              className="bg-proxio-accent hover:bg-proxio-accent-hover text-proxio-darker rounded-md px-5 py-2 text-sm font-bold transition-colors"
            >
              {t('nav.cta')}
            </Link>

            <button
              onClick={toggleLanguage}
              className="text-proxio-text-mute hover:text-proxio-text-main text-sm font-medium uppercase transition-colors"
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

      {/* Mobile menu drawer */}
      <div
        className={`border-proxio-dark-border bg-proxio-dark overflow-hidden border-t transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mx-auto max-w-7xl space-y-1 px-4 pb-6 pt-3 sm:px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.translationKey}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-proxio-text-main hover:text-proxio-accent hover:bg-proxio-dark-border block rounded-md px-4 py-3 text-base font-medium transition-colors"
            >
              {t(link.translationKey)}
            </Link>
          ))}

          <div className="border-proxio-dark-border mt-4 border-t pt-4 flex items-center justify-between gap-4">
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="bg-proxio-accent hover:bg-proxio-accent-hover text-proxio-darker flex-1 rounded-md px-5 py-3 text-center text-sm font-bold transition-colors"
            >
              {t('nav.cta')}
            </Link>

            <button
              onClick={() => { toggleLanguage(); setIsMenuOpen(false); }}
              className="text-proxio-text-mute hover:text-proxio-text-main border-proxio-dark-border rounded-md border px-4 py-3 text-sm font-medium uppercase transition-colors"
            >
              {i18n.language === 'pt' ? 'EN' : 'PT'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
