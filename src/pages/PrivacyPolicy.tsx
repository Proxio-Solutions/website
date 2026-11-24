import SectionLabel from '@components/motion/SectionLabel';
import SEO from '@components/SEO';
import { Link } from '@components/LocalizedLink';
import { CONTACT_EMAIL } from '@/config/links';
import { scrollToTarget } from '@/lib/smoothScroll';
import type { MouseEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

const linkClass =
  'text-proxio-text-main hover:text-proxio-accent decoration-proxio-accent/60 font-medium underline decoration-2 underline-offset-4 transition-colors';

/** Tags the copy may use: <email> for our address, <cnpd> for the data protection authority. */
const components = {
  email: <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass} />,
  cnpd: (
    <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" className={linkClass} />
  ),
};

/** Each section and its anchor. Anchors stay in English in both languages (see urls.md). */
const SECTIONS = [
  ['intro', 'introduction'],
  ['controller', 'controller'],
  ['dataCollected', 'data-collected'],
  ['usage', 'how-we-use-data'],
  ['legal', 'legal-basis'],
  ['retention', 'retention'],
  ['thirdParties', 'third-parties'],
  ['rights', 'your-rights'],
  ['cookies', 'cookies'],
  ['contact', 'data-requests'],
] as const;

/**
 * The smooth scroller overrides the browser's own jump to an anchor: scroll there ourselves,
 * keep the anchor in the address bar and move keyboard focus to the section.
 */
function jumpTo(event: MouseEvent<HTMLAnchorElement>, anchor: string) {
  const section = document.getElementById(anchor);
  if (!section) return;
  event.preventDefault();
  history.replaceState(null, '', `#${anchor}`);
  section.focus({ preventScroll: true });
  scrollToTarget(section);
}

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('privacyPolicy.title')} description={t('privacyPolicy.seo.description')} />

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <header className="max-w-3xl">
          <SectionLabel>{t('privacyPolicy.label')}</SectionLabel>
          <h1 className="text-proxio-text-main mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t('privacyPolicy.title')}
          </h1>
          <p className="text-proxio-text-muted mt-4 text-sm">{t('privacyPolicy.lastUpdated')}</p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
          {/* A long legal page: let readers jump to the part they came for */}
          <nav
            aria-labelledby="privacy-toc"
            className="bg-proxio-dark border-proxio-dark-border rounded-2xl border p-5 lg:sticky lg:top-28 lg:self-start lg:border-0 lg:bg-transparent lg:p-0"
          >
            <h2
              id="privacy-toc"
              className="text-proxio-text-main font-mono text-xs font-medium tracking-[0.2em] uppercase"
            >
              {t('privacyPolicy.toc')}
            </h2>
            <ol className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-1">
              {SECTIONS.map(([section, anchor]) => (
                <li key={section}>
                  <a
                    href={`#${anchor}`}
                    onClick={(event) => jumpTo(event, anchor)}
                    className="text-proxio-text-muted hover:text-proxio-accent text-sm leading-snug transition-colors"
                  >
                    {t(`privacyPolicy.${section}.title`)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-xl space-y-12">
            {SECTIONS.map(([section, anchor]) => {
              const items = t(`privacyPolicy.${section}.items`, {
                returnObjects: true,
                defaultValue: null,
              }) as string[] | null;

              return (
                <section key={section} id={anchor} tabIndex={-1} className="outline-none">
                  <h2 className="text-proxio-text-main mb-4 text-2xl font-bold tracking-tight">
                    {t(`privacyPolicy.${section}.title`)}
                  </h2>
                  <p className="text-proxio-text-muted text-lg leading-relaxed">
                    <Trans
                      i18nKey={`privacyPolicy.${section}.body`}
                      values={{ email: CONTACT_EMAIL }}
                      components={components}
                    />
                  </p>
                  {Array.isArray(items) && items.length > 0 && (
                    <ul className="text-proxio-text-muted marker:text-proxio-accent mt-4 list-disc space-y-2 pl-5 text-lg leading-relaxed">
                      {items.map((_, i) => (
                        <li key={i}>
                          <Trans
                            i18nKey={`privacyPolicy.${section}.items.${i}`}
                            components={components}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}

            {/* Close with a way to act, not just the end of the text */}
            <aside className="bg-proxio-dark border-proxio-dark-border flex flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <p className="text-proxio-text-main text-lg font-bold">
                {t('privacyPolicy.closing.title')}
              </p>
              <Link
                viewTransition
                to="/contact"
                className="bg-proxio-accent hover:bg-proxio-accent-hover inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-bold text-white transition-colors sm:w-auto"
              >
                {t('privacyPolicy.closing.cta')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
