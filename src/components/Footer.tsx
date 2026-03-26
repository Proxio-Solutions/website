import bannerIllustration from '@assets/banner.svg';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../config/navigation';

const serviceLinks = [
  { key: 'web', href: '/services#service-web' },
  { key: 'mobile', href: '/services#service-mobile' },
  { key: 'consulting', href: '/services#service-consulting' },
] as const;

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-proxio-dark border-proxio-dark-border border-t">
      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/">
              <img src={bannerIllustration} alt="Proxio Solutions" className="h-8 w-auto opacity-90" />
            </Link>
            <p className="text-proxio-text-muted mt-4 max-w-xs text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-proxio-text-main mb-4 text-sm font-bold tracking-widest uppercase">
              {t('footer.company')}
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.translationKey}>
                  <Link
                    to={link.href}
                    className="text-proxio-text-muted hover:text-proxio-accent text-sm transition-colors"
                  >
                    {t(link.translationKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-proxio-text-main mb-4 text-sm font-bold tracking-widest uppercase">
              {t('footer.services')}
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    to={href}
                    className="text-proxio-text-muted hover:text-proxio-accent text-sm transition-colors"
                  >
                    {t(`footer.services_${key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-proxio-text-main mb-4 text-sm font-bold tracking-widest uppercase">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:proxiosolutions@gmail.com"
                  className="text-proxio-text-muted hover:text-proxio-accent text-sm transition-colors"
                >
                  proxiosolutions@gmail.com
                </a>
              </li>
              <li>
                <span className="text-proxio-text-muted text-sm">Portugal</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-proxio-dark-border border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-proxio-text-muted text-sm">
            {t('footer.copyright', { year })}
          </p>
          <Link
            to="/privacy-policy"
            className="text-proxio-text-muted hover:text-proxio-accent text-sm transition-colors"
          >
            {t('footer.privacy')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
