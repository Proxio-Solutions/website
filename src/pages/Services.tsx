import HighlightedText from '@components/HighlightedText';
import SEO from '@components/SEO';
import { Check, Code2, Globe, Lightbulb, PenLine, Rocket, Search, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const serviceIcons = { web: Globe, mobile: Smartphone, consulting: Lightbulb } as const;

const heroHighlights: Record<string, string[]> = {
  pt: ['Ideias', 'Software'],
  en: ['Ideas', 'Software'],
};

const processSteps = [
  { key: 'discover', icon: Search, step: '01' },
  { key: 'design', icon: PenLine, step: '02' },
  { key: 'build', icon: Code2, step: '03' },
  { key: 'launch', icon: Rocket, step: '04' },
] as const;

export default function Services() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <SEO title={t('services.title')} description={t('services.hero.subtitle')} />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
              {t('services.hero.label')}
            </span>
            <h1 className="text-proxio-text-main mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
              <HighlightedText text={t('services.hero.title')} words={heroHighlights[i18n.language] ?? heroHighlights.en} />
            </h1>
            <p className="text-proxio-text-muted mt-6 text-xl leading-relaxed">
              {t('services.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Service Cards */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {(Object.keys(serviceIcons) as Array<keyof typeof serviceIcons>).map((key) => {
                const Icon = serviceIcons[key];
                const features = t(`services.items.${key}.features`, {
                  returnObjects: true,
                }) as string[];
                return (
                  <div
                    key={key}
                    id={`service-${key}`}
                    className="bg-proxio-darker border-proxio-dark-border flex flex-col rounded-2xl border p-8"
                  >
                    <div className="bg-proxio-accent/10 mb-6 inline-flex self-start rounded-xl p-4">
                      <Icon className="text-proxio-accent h-7 w-7" />
                    </div>
                    <h2 className="text-proxio-text-main mb-4 text-2xl font-bold">
                      {t(`services.items.${key}.title`)}
                    </h2>
                    <p className="text-proxio-text-muted mb-6 leading-relaxed">
                      {t(`services.items.${key}.desc`)}
                    </p>
                    <ul className="mt-auto space-y-2.5">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="text-proxio-text-muted flex items-center gap-2.5 text-sm"
                        >
                          <Check className="text-proxio-accent h-4 w-4 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
              {t('services.process.label')}
            </span>
            <h2 className="text-proxio-text-main mt-3 text-3xl font-extrabold sm:text-4xl">
              {t('services.process.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map(({ key, icon: Icon, step }) => (
              <div key={key} className="text-center">
                <div className="text-proxio-dark-border mb-3 text-5xl font-black">{step}</div>
                <div className="bg-proxio-accent/10 border-proxio-dark-border mx-auto mb-4 inline-flex rounded-xl border p-3">
                  <Icon className="text-proxio-accent h-6 w-6" />
                </div>
                <h3 className="text-proxio-text-main mb-2 text-lg font-bold">
                  {t(`services.process.${key}.title`)}
                </h3>
                <p className="text-proxio-text-muted text-sm leading-relaxed">
                  {t(`services.process.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="border-proxio-dark-border bg-proxio-dark rounded-2xl border p-12 text-center">
            <h2 className="text-proxio-text-main text-3xl font-extrabold sm:text-4xl">
              {t('services.cta.title')}
            </h2>
            <p className="text-proxio-text-muted mt-4 text-lg">{t('services.cta.subtitle')}</p>
            <Link
              to="/contact"
              className="bg-proxio-accent hover:bg-proxio-accent-hover mt-8 inline-block rounded-lg px-8 py-3.5 text-base font-bold text-white transition-colors"
            >
              {t('services.cta.button')}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
