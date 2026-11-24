import bannerIllustration from '@assets/banner.svg';
import WordmarkDots from '@components/motion/WordmarkDots';
import { useTranslation } from 'react-i18next';
import { Link, NavLink } from '@components/LocalizedLink';
import { CONTACT_EMAIL } from '../config/links';
import { NAV_LINKS } from '../config/navigation';

const serviceLinks = [
  { key: 'web', href: '/services#service-web' },
  { key: 'mobile', href: '/services#service-mobile' },
  { key: 'consulting', href: '/services#service-consulting' },
] as const;

/** Page links show where the visitor is; NavLink also sets aria-current="page". */
const footerLinkClass = ({ isActive }: { isActive: boolean }) =>
  `${isActive ? 'text-proxio-text-main font-semibold' : 'text-proxio-text-muted'} hover:text-proxio-accent text-sm transition-colors`;

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
            <Link viewTransition to="/">
              <img
                src={bannerIllustration}
                alt="Proxio Solutions"
                className="h-8 w-auto opacity-90"
              />
            </Link>
            <p className="text-proxio-text-muted mt-4 max-w-xs text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-proxio-text-main mb-4 text-sm font-bold tracking-widest uppercase">
              {t('footer.company')}
            </h2>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.translationKey}>
                  <NavLink viewTransition to={link.href} end className={footerLinkClass}>
                    {t(link.translationKey)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h2 className="text-proxio-text-main mb-4 text-sm font-bold tracking-widest uppercase">
              {t('footer.services')}
            </h2>
            <ul className="space-y-3">
              {serviceLinks.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    viewTransition
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
            <h2 className="text-proxio-text-main mb-4 text-sm font-bold tracking-widest uppercase">
              {t('footer.contact')}
            </h2>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-proxio-text-muted hover:text-proxio-accent text-sm transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <span className="text-proxio-text-muted text-sm">Portugal</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Brand signature: the word in the hero's dot language */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-[clamp(72px,12vw,170px)] w-full pb-6">
          <WordmarkDots />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-proxio-dark-border border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          {/* The pre-rendered HTML carries the build year; the client may be in a newer one */}
          <p className="text-proxio-text-muted text-sm" suppressHydrationWarning>
            {t('footer.copyright', { year })}
          </p>
          <NavLink viewTransition to="/privacy-policy" className={footerLinkClass}>
            {t('footer.privacy')}
          </NavLink>
        </div>
      </div>
    </footer>
  );
}
