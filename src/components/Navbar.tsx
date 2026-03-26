import bannerIllustration from '@assets/banner.svg';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../config/navigation';

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="bg-proxio-dark border-proxio-dark-border border-b shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex shrink-0 items-center">
            <img
              src={bannerIllustration}
              alt={'Proxio Solutions'}
              className="h-10 w-auto opacity-90"
            />
          </Link>

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
        </div>
      </div>
    </nav>
  );
}
