import voidIllustration from '@assets/void.svg';
import DotGrid from '@components/motion/DotGrid';
import Magnetic from '@components/motion/Magnetic';
import { NAV_LINKS } from '@/config/navigation';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@components/LocalizedLink';

/** Where a lost visitor most likely wanted to go: every page in the menu except home. */
const SUGGESTIONS = NAV_LINKS.filter(({ href }) => href !== '/');

/** The path as a visitor typed it. A malformed escape (`%E0%A4%A`) makes decodeURI throw. */
function readablePath(raw: string) {
  try {
    return decodeURI(raw);
  } catch {
    return raw;
  }
}

export default function NotFound() {
  const { t } = useTranslation();
  // The address that failed. Read after hydration: the pre-rendered 404 page has no real path.
  const [path, setPath] = useState<string | null>(null);
  useEffect(() => {
    // The URL only exists in the browser, so this sync has to happen in an effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPath(readablePath(window.location.pathname));
  }, []);

  return (
    <main className="relative flex grow flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-32 lg:px-8">
      {/* Not the SEO component: a missing page has no canonical URL or other-language twin */}
      <title>{`${t('notFound.title')} | Proxio Solutions`}</title>
      <meta name="robots" content="noindex" />
      <div className="hero-mask pointer-events-none absolute inset-0" aria-hidden="true">
        <DotGrid />
      </div>

      <div className="relative flex flex-col items-center text-center">
        <p className="text-proxio-accent font-mono text-sm font-medium tracking-[0.2em] uppercase">
          <span className="opacity-80" aria-hidden="true">
            //{' '}
          </span>
          {t('notFound.label')}
        </p>

        <h1 className="text-proxio-text-main mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {t('notFound.title')}
        </h1>

        <img src={voidIllustration} alt="" className="float my-6 w-32 md:w-40" />

        <p className="text-proxio-text-muted mx-auto mt-4 max-w-md text-lg">
          {t('notFound.description')}
        </p>
        {path && (
          <p className="text-proxio-text-muted mt-2 max-w-md font-mono text-sm break-all">{path}</p>
        )}

        <div className="mt-8 w-full sm:w-auto">
          <Magnetic className="w-full sm:w-auto">
            <Link
              viewTransition
              to="/"
              className="group bg-proxio-accent hover:bg-proxio-accent-hover flex w-full items-center justify-center gap-2 rounded-lg px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              {t('notFound.backHome')}
            </Link>
          </Magnetic>
        </div>

        <nav aria-label={t('notFound.suggestions')} className="mt-8">
          <p className="text-proxio-text-muted text-sm">{t('notFound.suggestions')}</p>
          <ul className="mt-1 flex flex-wrap justify-center gap-x-2">
            {SUGGESTIONS.map(({ translationKey, href }) => (
              <li key={href}>
                <Link
                  viewTransition
                  to={href}
                  className="text-proxio-text-main hover:text-proxio-accent inline-block px-3 py-3 text-base font-semibold underline-offset-4 transition-colors hover:underline"
                >
                  {t(translationKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
