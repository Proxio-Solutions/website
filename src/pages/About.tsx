import HighlightedText from '@components/HighlightedText';
import SEO from '@components/SEO';
import { Eye, Hammer, Lightbulb, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const valueIcons = {
  craft: Hammer,
  partnership: Users,
  innovation: Lightbulb,
  transparency: Eye,
} as const;
const teamMembers = ['member1', 'member2'] as const;

const highlightWords: Record<string, string[]> = {
  pt: ['Tecnologia', 'Conecta', 'Inspira'],
  en: ['Technology', 'Connects', 'Inspires'],
};

export default function About() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <SEO title={t('about.title')} description={t('about.mission.desc')} />

      <main>
        {/* Mission */}
        <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
              {t('about.mission.label')}
            </span>
            <h1 className="text-proxio-text-main mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
              <HighlightedText text={t('about.mission.title')} words={highlightWords[i18n.language] ?? highlightWords.en} />
            </h1>
            <p className="text-proxio-text-muted mt-6 text-xl leading-relaxed">
              {t('about.mission.desc')}
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
                  {t('about.story.label')}
                </span>
                <h2 className="text-proxio-text-main mt-3 text-3xl font-extrabold sm:text-4xl">
                  {t('about.story.title')}
                </h2>
              </div>
              <div className="space-y-5">
                <p className="text-proxio-text-muted text-lg leading-relaxed">
                  {t('about.story.p1')}
                </p>
                <p className="text-proxio-text-muted text-lg leading-relaxed">
                  {t('about.story.p2')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
              {t('about.values.label')}
            </span>
            <h2 className="text-proxio-text-main mt-3 text-3xl font-extrabold sm:text-4xl">
              {t('about.values.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {(Object.keys(valueIcons) as Array<keyof typeof valueIcons>).map((key) => {
              const Icon = valueIcons[key];
              return (
                <div
                  key={key}
                  className="bg-proxio-dark border-proxio-dark-border rounded-2xl border p-8"
                >
                  <div className="bg-proxio-accent/10 mb-5 inline-flex rounded-xl p-3">
                    <Icon className="text-proxio-accent h-6 w-6" />
                  </div>
                  <h3 className="text-proxio-text-main mb-2 text-xl font-bold">
                    {t(`about.values.${key}.title`)}
                  </h3>
                  <p className="text-proxio-text-muted leading-relaxed">
                    {t(`about.values.${key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Team */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
                {t('about.team.label')}
              </span>
              <h2 className="text-proxio-text-main mt-3 text-3xl font-extrabold sm:text-4xl">
                {t('about.team.title')}
              </h2>
              <p className="text-proxio-text-muted mt-4 text-lg">{t('about.team.desc')}</p>
            </div>

            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2">
              {teamMembers.map((member) => (
                <div
                  key={member}
                  className="bg-proxio-darker border-proxio-dark-border rounded-2xl border p-8 text-center"
                >
                  <p className="text-proxio-text-muted mb-1 text-sm font-medium">
                    {t(`about.team.${member}.role`)}
                  </p>
                  <h3 className="text-proxio-text-main mb-3 text-xl font-bold">
                    {t(`about.team.${member}.name`)}
                  </h3>
                  <p className="text-proxio-text-muted text-sm leading-relaxed">
                    {t(`about.team.${member}.bio`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="border-proxio-dark-border bg-proxio-dark rounded-2xl border p-12 text-center">
            <h2 className="text-proxio-text-main text-3xl font-extrabold sm:text-4xl">
              {t('about.cta.title')}
            </h2>
            <Link
              to="/contact"
              className="bg-proxio-accent hover:bg-proxio-accent-hover mt-8 inline-block rounded-lg px-8 py-3.5 text-base font-bold text-white transition-colors"
            >
              {t('about.cta.button')}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
