import CtaSection from '@components/motion/CtaSection';
import PageHero from '@components/motion/PageHero';
import ScrollHighlight from '@components/motion/ScrollHighlight';
import SectionHeader from '@components/motion/SectionHeader';
import SpotlightCard from '@components/motion/SpotlightCard';
import Reveal from '@components/Reveal';
import SEO from '@components/SEO';
import { Eye, Hammer, Lightbulb, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getTeamMembers } from '../services/teamService';

const valueIcons = {
  craft: Hammer,
  partnership: Users,
  innovation: Lightbulb,
  transparency: Eye,
} as const;
const teamMembers = getTeamMembers();

const highlightWords: Record<string, string[]> = {
  pt: ['Tecnologia', 'Conecta', 'Inspira'],
  en: ['Technology', 'Connects', 'Inspires'],
};

/** "Diogo Santos" → "DS" */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function About() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <SEO title={t('about.title')} description={t('about.mission.desc')} />

      <main>
        {/* Mission */}
        <PageHero
          label={t('about.mission.label')}
          title={t('about.mission.title')}
          highlights={highlightWords[i18n.language] ?? highlightWords.en}
          subtitle={t('about.mission.desc')}
        />

        {/* Story: words light up while reading */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_2fr] lg:px-8">
            <SectionHeader
              index="01"
              label={t('about.story.label')}
              title={t('about.story.title')}
              className="lg:sticky lg:top-28 lg:self-start"
            />
            <div className="space-y-8">
              <ScrollHighlight
                text={t('about.story.p1')}
                className="text-proxio-text-main text-2xl leading-snug font-semibold sm:text-3xl"
              />
              <ScrollHighlight
                text={t('about.story.p2')}
                className="text-proxio-text-main text-2xl leading-snug font-semibold sm:text-3xl"
              />
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader
            index="02"
            label={t('about.values.label')}
            title={t('about.values.title')}
            align="center"
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {(Object.keys(valueIcons) as Array<keyof typeof valueIcons>).map((key, index) => {
              const Icon = valueIcons[key];
              return (
                <Reveal key={key} delay={(index % 2) * 100}>
                  <SpotlightCard className="group bg-proxio-dark border-proxio-dark-border h-full rounded-2xl border p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="bg-proxio-accent/10 group-hover:bg-proxio-accent inline-flex rounded-xl p-3 transition-colors duration-300">
                        <Icon className="text-proxio-accent h-6 w-6 transition-colors duration-300 group-hover:text-white" />
                      </div>
                      <span className="text-proxio-text-muted font-mono text-xs">
                        [0{index + 1}]
                      </span>
                    </div>
                    <h3 className="text-proxio-text-main mb-2 text-xl font-bold">
                      {t(`about.values.${key}.title`)}
                    </h3>
                    <p className="text-proxio-text-muted leading-relaxed">
                      {t(`about.values.${key}.desc`)}
                    </p>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Team */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              index="03"
              label={t('about.team.label')}
              title={t('about.team.title')}
              subtitle={t('about.team.desc')}
              align="center"
            />

            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2">
              {teamMembers.map(({ id }, index) => {
                const name = t(`about.team.${id}.name`);
                return (
                  <Reveal key={id} delay={index * 120}>
                    <SpotlightCard className="group bg-proxio-darker border-proxio-dark-border h-full rounded-2xl border p-8 text-center">
                      <div className="from-proxio-accent mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br to-blue-400 text-xl font-extrabold text-white shadow-lg shadow-blue-600/20 transition-transform duration-500 group-hover:rotate-6">
                        {initials(name)}
                      </div>
                      <p className="text-proxio-accent mb-1 font-mono text-xs tracking-wider uppercase">
                        {t(`about.team.${id}.role`)}
                      </p>
                      <h3 className="text-proxio-text-main mb-3 text-xl font-bold">{name}</h3>
                      <p className="text-proxio-text-muted text-sm leading-relaxed">
                        {t(`about.team.${id}.bio`)}
                      </p>
                    </SpotlightCard>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <div className="pt-24">
          <CtaSection
            title={t('about.cta.title')}
            primary={{ to: '/contact', label: t('about.cta.button') }}
          />
        </div>
      </main>
    </>
  );
}
