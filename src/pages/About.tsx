import CtaSection from '@components/motion/CtaSection';
import PageHero from '@components/motion/PageHero';
import ScrollHighlight from '@components/motion/ScrollHighlight';
import SectionHeader from '@components/motion/SectionHeader';
import SpotlightCard from '@components/motion/SpotlightCard';
import Reveal from '@components/Reveal';
import SEO from '@components/SEO';
import { Link } from '@components/LocalizedLink';
import { ArrowRight, Eye, Hammer, Lightbulb, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getTeamMembers } from '../services/teamService';

const valueIcons = {
  craft: Hammer,
  partnership: Users,
  innovation: Lightbulb,
  transparency: Eye,
} as const;
const teamMembers = getTeamMembers();

const STORY_LINKS = [
  { href: '/services', translationKey: 'nav.services' },
  { href: '/projects', translationKey: 'nav.projects' },
] as const;

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
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('about.seo.title')} description={t('about.seo.description')} />

      <main>
        {/* Mission */}
        <PageHero
          label={t('about.mission.label')}
          title={t('about.mission.title')}
          highlights={t('about.mission.highlights', { returnObjects: true }) as string[]}
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
                className="text-proxio-text-main text-xl leading-snug font-medium sm:text-3xl sm:font-semibold"
              />
              <ScrollHighlight
                text={t('about.story.p2')}
                className="text-proxio-text-main text-xl leading-snug font-medium sm:text-3xl sm:font-semibold"
              />
              {/* Where the story leads: what we do, and what we are building */}
              <nav
                aria-label={t('about.story.label')}
                className="flex flex-wrap gap-x-8 gap-y-3 pt-2"
              >
                {STORY_LINKS.map(({ href, translationKey }) => (
                  <Link
                    key={href}
                    viewTransition
                    to={href}
                    className="text-proxio-accent hover:text-proxio-accent-hover group inline-flex items-center gap-1.5 font-bold"
                  >
                    {t(translationKey)}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </nav>
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
                    <div className="bg-proxio-accent/10 mb-6 inline-flex rounded-xl p-3">
                      <Icon className="text-proxio-accent h-6 w-6" />
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
                      <div className="from-proxio-accent mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br to-blue-500 text-xl font-extrabold text-white shadow-lg shadow-blue-600/20">
                        {initials(name)}
                      </div>
                      <h3 className="text-proxio-text-main text-xl font-bold">{name}</h3>
                      <p className="text-proxio-accent mt-1 mb-3 text-sm font-semibold">
                        {t(`about.team.${id}.role`)}
                      </p>
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
