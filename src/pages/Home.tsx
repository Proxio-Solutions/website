import HighlightedText from '@components/HighlightedText';
import SEO from '@components/SEO';
import { ArrowRight, Gem, Users, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const valueIcons = { client: Users, quality: Gem, modern: Zap } as const;

const heroHighlights: Record<string, string[]> = {
  pt: ['Soluções Digitais', 'Diferença'],
  en: ['Digital Solutions', 'Difference'],
};

export default function Home() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <SEO title={t('nav.home')} description={t('home.hero.subtitle')} />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-proxio-text-main mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              <HighlightedText
                text={t('home.hero.title')}
                words={heroHighlights[i18n.language] ?? heroHighlights.en}
              />
            </h1>
            <p className="text-proxio-text-muted mt-6 text-xl leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/contact"
                className="bg-proxio-accent hover:bg-proxio-accent-hover w-full rounded-lg px-8 py-3.5 text-base font-bold text-white transition-colors sm:w-auto"
              >
                {t('home.hero.cta')}
              </Link>
              <Link
                to="/projects"
                className="border-proxio-dark-border text-proxio-text-main hover:border-proxio-accent hover:text-proxio-accent flex w-full items-center justify-center gap-2 rounded-lg border px-8 py-3.5 text-base font-bold transition-colors sm:w-auto"
              >
                {t('home.hero.learnMore')}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
        {/* Our Principles */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
                {t('home.values.label')}
              </span>
              <h2 className="text-proxio-text-main mt-3 text-3xl font-extrabold sm:text-4xl">
                {t('home.values.title')}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {(Object.keys(valueIcons) as Array<keyof typeof valueIcons>).map((key) => {
                const Icon = valueIcons[key];
                return (
                  <div key={key} className="text-center">
                    <div className="bg-proxio-darker border-proxio-dark-border mx-auto mb-5 inline-flex rounded-full border p-4">
                      <Icon className="text-proxio-accent h-6 w-6" />
                    </div>
                    <h3 className="text-proxio-text-main mb-3 text-xl font-bold">
                      {t(`home.values.${key}.title`)}
                    </h3>
                    <p className="text-proxio-text-muted leading-relaxed">
                      {t(`home.values.${key}.desc`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Project */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
              {t('home.featured.label')}
            </span>
            <h2 className="text-proxio-text-main mt-2 text-3xl font-extrabold">
              {t('home.featured.title')}
            </h2>
          </div>

          <div className="bg-proxio-accent overflow-hidden rounded-2xl">
            <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center md:justify-between md:p-12">
              <div className="text-white">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white"></span>
                  </span>
                  {t('projects.status.development')}
                </div>
                <h3 className="mt-2 text-4xl font-extrabold">Urbi</h3>
                <p className="mt-3 max-w-lg text-lg leading-relaxed opacity-90">
                  {t('projects.urbi.description')}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['React', 'React Native', '.NET', 'TypeScript'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-white/20 px-3 py-1 text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                to="/projects"
                className="text-proxio-accent shrink-0 self-start rounded-xl bg-white px-6 py-3 text-sm font-bold transition-opacity hover:opacity-75"
              >
                {t('home.hero.learnMore')} →
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="border-proxio-dark-border bg-proxio-dark rounded-2xl border p-12 text-center">
            <h2 className="text-proxio-text-main text-3xl font-extrabold sm:text-4xl">
              {t('home.cta.title')}
            </h2>
            <p className="text-proxio-text-muted mt-4 text-lg">{t('home.cta.subtitle')}</p>
            <Link
              to="/contact"
              className="bg-proxio-accent hover:bg-proxio-accent-hover mt-8 inline-block rounded-lg px-8 py-3.5 text-base font-bold text-white transition-colors"
            >
              {t('home.cta.button')}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
