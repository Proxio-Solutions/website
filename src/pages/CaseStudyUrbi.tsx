import CountUp from '@components/motion/CountUp';
import CtaSection from '@components/motion/CtaSection';
import PageHero from '@components/motion/PageHero';
import ScrollHighlight from '@components/motion/ScrollHighlight';
import SectionHeader from '@components/motion/SectionHeader';
import SectionLabel from '@components/motion/SectionLabel';
import SpotlightCard from '@components/motion/SpotlightCard';
import Reveal from '@components/Reveal';
import SEO from '@components/SEO';
import { URBI_WEBSITE_URL } from '@/config/links';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import {
  ArrowUpRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  Circle,
  ClipboardList,
  Ear,
  Loader,
  Shuffle,
  Sparkles,
  User,
} from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const problemCards = [
  { icon: Shuffle, key: 'card1' },
  { icon: Ear, key: 'card2' },
  { icon: ClipboardList, key: 'card3' },
] as const;

const featureGroups = [
  { icon: User, key: 'residents' },
  { icon: Building2, key: 'junta' },
  { icon: Sparkles, key: 'ai' },
] as const;

const buildHighlights = ['h1', 'h2', 'h3', 'h4'] as const;

const stackItems = ['dotnet', 'postgres', 'react', 'reactNative', 'signalr', 'azure'] as const;

const roadmapSteps = [
  { key: 'step1', status: 'done' },
  { key: 'step2', status: 'done' },
  { key: 'step3', status: 'active' },
  { key: 'step4', status: 'upcoming' },
  { key: 'step5', status: 'upcoming' },
] as const;

/** Share of the roadmap track that is "travelled": up to the active step's node. */
const roadmapProgress =
  roadmapSteps.findIndex((step) => step.status === 'active') / (roadmapSteps.length - 1);

export default function CaseStudyUrbi() {
  const { t } = useTranslation();
  const u = 'caseStudies.urbi';
  const roadmapRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          '.roadmap-fill',
          { scaleY: 0 },
          {
            scaleY: roadmapProgress,
            ease: 'none',
            scrollTrigger: {
              trigger: roadmapRef.current,
              start: 'top 70%',
              end: 'bottom 60%',
              scrub: 0.4,
            },
          },
        );
        gsap.from('.roadmap-step', {
          x: -24,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: roadmapRef.current, start: 'top 75%' },
        });
      });
    },
    { scope: roadmapRef },
  );

  return (
    <>
      <SEO title={t(`${u}.meta.title`)} description={t(`${u}.meta.description`)} />

      <main>
        <PageHero
          align="left"
          size="xl"
          label={t(`${u}.hero.tag`)}
          title={t(`${u}.hero.title`)}
          subtitle={t(`${u}.hero.subtitle`)}
          before={
            <Link
              to="/projects"
              className="text-proxio-text-muted hover:text-proxio-accent group mb-10 inline-flex w-max items-center gap-2 text-sm font-medium transition-colors"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {t(`${u}.hero.backLink`)}
            </Link>
          }
        >
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a
              href={URBI_WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-proxio-accent hover:bg-proxio-accent-hover shadow-proxio-accent/25 group inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors"
            >
              {t(`${u}.hero.visitSite`)}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <span className="text-proxio-text-muted text-sm">{t(`${u}.hero.siteNote`)}</span>
          </div>

          <dl className="border-proxio-dark-border mt-14 grid grid-cols-2 border-t lg:grid-cols-4">
            {(['stat1', 'stat2', 'stat3', 'stat4'] as const).map((stat) => (
              <div key={stat} className="py-6 pr-4">
                <dt className="text-proxio-text-muted font-mono text-xs tracking-wider uppercase">
                  {t(`${u}.hero.${stat}Label`)}
                </dt>
                <dd className="text-proxio-text-main mt-2 text-2xl font-extrabold sm:text-3xl">
                  <CountUp
                    value={t(`${u}.hero.${stat}Value`)}
                    suffixClassName="text-proxio-accent"
                  />
                </dd>
              </div>
            ))}
          </dl>
        </PageHero>

        {/* The Problem */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              index="01"
              label={t(`${u}.problem.label`)}
              title={t(`${u}.problem.title`)}
              subtitle={t(`${u}.problem.intro`)}
              className="mb-12"
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {problemCards.map(({ icon: Icon, key }, index) => (
                <Reveal key={key} delay={index * 100}>
                  <SpotlightCard className="bg-proxio-darker border-proxio-dark-border h-full rounded-2xl border p-8">
                    <div className="mb-4 inline-flex rounded-xl bg-red-50 p-3">
                      <Icon className="h-6 w-6 text-red-500" />
                    </div>
                    <h3 className="text-proxio-text-main mb-2 text-lg font-bold">
                      {t(`${u}.problem.${key}Title`)}
                    </h3>
                    <p className="text-proxio-text-muted text-sm leading-relaxed">
                      {t(`${u}.problem.${key}Desc`)}
                    </p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* The Solution: dark panel, body lights up while scrolling */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[#0b1120] p-8 text-white md:p-14">
            <div className="urbi-grid pointer-events-none absolute inset-0" aria-hidden="true" />
            <div
              className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-blue-600/25 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              <SectionLabel index="02" className="!text-blue-400">
                {t(`${u}.solution.label`)}
              </SectionLabel>
              <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
                {t(`${u}.solution.title`)}
              </h2>
              <ScrollHighlight
                text={t(`${u}.solution.body`)}
                className="mt-8 max-w-4xl text-xl leading-relaxed font-medium sm:text-2xl"
              />
            </div>
          </div>
        </section>

        {/* Platform Overview */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              index="03"
              label={t(`${u}.features.label`)}
              title={t(`${u}.features.title`)}
              align="center"
              className="mb-12"
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {featureGroups.map(({ icon: Icon, key }, index) => {
                const items = t(`${u}.features.${key}.items`, {
                  returnObjects: true,
                }) as string[];
                return (
                  <Reveal key={key} delay={index * 100}>
                    <SpotlightCard className="group bg-proxio-darker border-proxio-dark-border h-full rounded-2xl border p-8">
                      <div className="bg-proxio-accent/10 group-hover:bg-proxio-accent mb-5 inline-flex rounded-xl p-3 transition-colors duration-300">
                        <Icon className="text-proxio-accent h-6 w-6 transition-colors duration-300 group-hover:text-white" />
                      </div>
                      <h3 className="text-proxio-text-main mb-4 text-xl font-bold">
                        {t(`${u}.features.${key}.title`)}
                      </h3>
                      <ul className="space-y-3">
                        {items.map((item) => (
                          <li
                            key={item}
                            className="text-proxio-text-muted flex gap-2.5 text-sm leading-relaxed"
                          >
                            <Check className="text-proxio-accent mt-0.5 h-4 w-4 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </SpotlightCard>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Inside the Development */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start">
            <div>
              <SectionHeader
                index="04"
                label={t(`${u}.build.label`)}
                title={t(`${u}.build.title`)}
                className="mb-6"
              />
              <Reveal className="space-y-5">
                {(['p1', 'p2', 'p3'] as const).map((p) => (
                  <p key={p} className="text-proxio-text-muted text-lg leading-relaxed">
                    {t(`${u}.build.${p}`)}
                  </p>
                ))}
              </Reveal>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {buildHighlights.map((key, index) => (
                <Reveal key={key} delay={index * 100}>
                  <SpotlightCard className="bg-proxio-dark border-proxio-dark-border h-full rounded-2xl border p-6">
                    <span className="text-proxio-accent font-mono text-xs">0{index + 1}</span>
                    <h3 className="text-proxio-text-main mt-1 mb-2 text-base font-bold">
                      {t(`${u}.build.${key}Title`)}
                    </h3>
                    <p className="text-proxio-text-muted text-sm leading-relaxed">
                      {t(`${u}.build.${key}Desc`)}
                    </p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              index="05"
              label={t(`${u}.stack.label`)}
              title={t(`${u}.stack.title`)}
              className="mb-12"
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stackItems.map((key, index) => (
                <Reveal key={key} delay={(index % 3) * 100}>
                  <SpotlightCard className="bg-proxio-darker border-proxio-dark-border h-full rounded-2xl border p-8">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="text-proxio-text-main text-xl font-black">
                        {t(`${u}.stack.${key}.name`)}
                      </span>
                      <span className="bg-proxio-accent/10 text-proxio-accent shrink-0 rounded-full px-3 py-1 font-mono text-[11px] font-medium">
                        {t(`${u}.stack.${key}.role`)}
                      </span>
                    </div>
                    <p className="text-proxio-text-muted mt-3 text-sm leading-relaxed">
                      {t(`${u}.stack.${key}.reason`)}
                    </p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap: the track fills up to the step in progress */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader
            index="06"
            label={t(`${u}.roadmap.label`)}
            title={t(`${u}.roadmap.title`)}
            className="mb-12"
          />

          <ol ref={roadmapRef} className="relative max-w-2xl space-y-8">
            <div
              className="bg-proxio-dark-border absolute top-3 bottom-3 left-3 w-px"
              aria-hidden="true"
            >
              <div
                className="roadmap-fill bg-proxio-accent h-full w-full origin-top"
                style={{ transform: `scaleY(${roadmapProgress})` }}
              />
            </div>
            {roadmapSteps.map(({ key, status }) => (
              <li key={key} className="roadmap-step relative flex items-start gap-5">
                <div className="bg-proxio-darker relative z-10 shrink-0 rounded-full">
                  {status === 'done' ? (
                    <CheckCircle2 className="text-proxio-accent h-6 w-6" />
                  ) : status === 'active' ? (
                    <Loader className="text-proxio-accent h-6 w-6 animate-[spin_3s_linear_infinite]" />
                  ) : (
                    <Circle className="text-proxio-dark-border h-6 w-6" />
                  )}
                </div>
                <div className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <span
                    className={`text-base font-medium ${
                      status === 'upcoming' ? 'text-proxio-text-muted' : 'text-proxio-text-main'
                    }`}
                  >
                    {t(`${u}.roadmap.${key}`)}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium ${
                      status === 'done'
                        ? 'bg-proxio-accent/10 text-proxio-accent'
                        : status === 'active'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-proxio-dark text-proxio-text-muted border-proxio-dark-border border'
                    }`}
                  >
                    {t(`${u}.roadmap.${status}`)}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <CtaSection
          title={t(`${u}.cta.title`)}
          subtitle={t(`${u}.cta.body`)}
          primary={{ to: '/contact', label: t(`${u}.cta.button`) }}
          secondary={{ href: URBI_WEBSITE_URL, label: t(`${u}.cta.secondary`) }}
        />
      </main>
    </>
  );
}
