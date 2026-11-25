import SectionLabel from '@components/motion/SectionLabel';
import SEO from '@components/SEO';
import { Link } from '@components/LocalizedLink';
import { CONTACT_EMAIL } from '@/config/links';
import { scrollToTarget } from '@/lib/smoothScroll';
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';

const linkClass =
  'text-proxio-text-main hover:text-proxio-accent decoration-proxio-accent/60 font-medium underline decoration-2 underline-offset-4 transition-colors';

/** A link that opens in a new window, and says so to screen readers. */
function ExternalLink({ href, children }: { href: string; children?: ReactNode }) {
  const { t } = useTranslation();
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
      <span className="sr-only"> {t('privacyPolicy.newWindow')}</span>
    </a>
  );
}

/** Tags the copy may use: <email> for our address, <cnpd> for the data protection authority. */
const components = {
  email: <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass} />,
  cnpd: <ExternalLink href="https://www.cnpd.pt" />,
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

/** The section being read: the last one whose heading has passed the upper third of the screen. */
function useCurrentSection() {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const sections = SECTIONS.map(([, anchor]) => document.getElementById(anchor)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setCurrent(visible[visible.length - 1].target.id);
      },
      // A thin band near the top: a section counts once its start reaches it
      { rootMargin: '-25% 0px -70% 0px' },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return current;
}

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  const current = useCurrentSection();

  const tocLinks = (
    <ol className="mt-3 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-1">
      {SECTIONS.map(([section, anchor]) => {
        const active = current === anchor;
        return (
          <li key={section}>
            <a
              href={`#${anchor}`}
              onClick={(event) => jumpTo(event, anchor)}
              aria-current={active ? 'location' : undefined}
              className={`-ml-3 block border-l-2 py-2 pl-3 text-sm leading-snug transition-colors lg:py-1.5 ${
                active
                  ? 'border-proxio-accent text-proxio-text-main font-semibold'
                  : 'text-proxio-text-muted hover:text-proxio-accent border-transparent'
              }`}
            >
              {t(`privacyPolicy.${section}.title`)}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <>
      <SEO title={t('privacyPolicy.title')} description={t('privacyPolicy.seo.description')} />

      <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <header className="max-w-3xl">
          <SectionLabel>{t('privacyPolicy.label')}</SectionLabel>
          <h1 className="text-proxio-text-main mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t('privacyPolicy.title')}
          </h1>
          <p className="text-proxio-text-muted mt-4 text-sm">{t('privacyPolicy.lastUpdated')}</p>
          {/* What most visitors came to check, before any of the legal detail */}
          <div className="border-proxio-accent bg-proxio-dark mt-8 rounded-r-2xl border-l-4 px-6 py-5">
            <p className="text-proxio-accent text-sm font-bold">
              {t('privacyPolicy.summary.label')}
            </p>
            <p className="text-proxio-text-main mt-1 text-lg leading-relaxed">
              {t('privacyPolicy.summary.body')}
            </p>
          </div>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
          {/* A long legal page: let readers jump to the part they came for. Phones get it folded,
              so the text starts on the first screen */}
          <details className="group bg-proxio-dark border-proxio-dark-border rounded-2xl border px-5 py-4 lg:hidden">
            <summary className="text-proxio-text-main flex cursor-pointer list-none items-center justify-between font-mono text-xs font-medium tracking-[0.2em] uppercase [&::-webkit-details-marker]:hidden">
              {t('privacyPolicy.toc')}
              <ChevronDown
                className="text-proxio-text-muted h-4 w-4 transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <nav aria-label={t('privacyPolicy.toc')} className="pl-3">
              {tocLinks}
            </nav>
          </details>
          <nav
            aria-labelledby="privacy-toc"
            className="hidden pl-3 lg:sticky lg:top-28 lg:block lg:self-start"
          >
            <h2
              id="privacy-toc"
              className="text-proxio-text-main font-mono text-xs font-medium tracking-[0.2em] uppercase"
            >
              {t('privacyPolicy.toc')}
            </h2>
            {tocLinks}
          </nav>

          <div className="max-w-xl space-y-12">
            {SECTIONS.map(([section, anchor]) => {
              const items = t(`privacyPolicy.${section}.items`, {
                returnObjects: true,
                defaultValue: null,
              }) as string[] | null;

              return (
                <section
                  key={section}
                  id={anchor}
                  tabIndex={-1}
                  // Reached from the index by keyboard: show where focus landed
                  className="focus-visible:ring-proxio-accent/40 -m-3 rounded-xl p-3 outline-none focus-visible:ring-2"
                >
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
