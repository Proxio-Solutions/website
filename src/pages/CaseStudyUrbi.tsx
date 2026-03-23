import SEO from '@components/SEO';
import {
  AlertCircle,
  Brain,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  Circle,
  FileText,
  Globe,
  MessageSquareOff,
  Network,
  Smartphone,
  TrendingUp,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const problemCards = [
  { icon: MessageSquareOff, key: 'card1' },
  { icon: AlertCircle, key: 'card2' },
  { icon: FileText, key: 'card3' },
] as const;

const featureGroups = [
  { icon: User, key: 'citizens' },
  { icon: Building2, key: 'municipalities' },
  { icon: Users, key: 'juntas' },
] as const;

const stackItems = [
  { key: 'dotnet', icon: Globe },
  { key: 'react', icon: Globe },
  { key: 'reactNative', icon: Smartphone },
  { key: 'tailwind', icon: FileText },
] as const;

const aiItems = [
  { icon: Zap, key: 'item1' },
  { icon: Network, key: 'item2' },
  { icon: TrendingUp, key: 'item3' },
] as const;

const roadmapSteps = [
  { key: 'step1', status: 'done' },
  { key: 'step2', status: 'done' },
  { key: 'step3', status: 'upcoming' },
  { key: 'step4', status: 'upcoming' },
  { key: 'step5', status: 'upcoming' },
  { key: 'step6', status: 'upcoming' },
  { key: 'step7', status: 'upcoming' },
] as const;

export default function CaseStudyUrbi() {
  const { t } = useTranslation();
  const u = 'caseStudies.urbi';

  return (
    <>
      <SEO title={t(`${u}.meta.title`)} description={t(`${u}.meta.description`)} />

      <main>
        {/* Back link + Hero */}
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="text-proxio-text-muted hover:text-proxio-accent mb-10 inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {t(`${u}.hero.backLink`)}
          </Link>

          <div className="mt-6">
            <span className="bg-proxio-accent/10 text-proxio-accent mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-semibold">
              {t(`${u}.hero.tag`)}
            </span>
            <h1 className="text-proxio-text-main text-6xl font-black tracking-tight sm:text-8xl">
              {t(`${u}.hero.title`)}
            </h1>
            <p className="text-proxio-text-muted mt-6 max-w-2xl text-xl leading-relaxed">
              {t(`${u}.hero.subtitle`)}
            </p>
          </div>

          {/* Stats */}
          <div className="border-proxio-dark-border mt-12 grid grid-cols-1 gap-px border-t sm:grid-cols-3">
            {(['stat1', 'stat2', 'stat3'] as const).map((stat) => (
              <div key={stat} className="py-6 sm:px-6 sm:first:pl-0">
                <p className="text-proxio-text-muted text-sm font-medium">
                  {t(`${u}.hero.${stat}Label`)}
                </p>
                <p className="text-proxio-text-main mt-1 text-2xl font-bold">
                  {t(`${u}.hero.${stat}Value`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* The Problem */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
                {t(`${u}.problem.label`)}
              </span>
              <h2 className="text-proxio-text-main mt-3 max-w-2xl text-3xl font-extrabold sm:text-4xl">
                {t(`${u}.problem.title`)}
              </h2>
              <p className="text-proxio-text-muted mt-5 max-w-3xl text-lg leading-relaxed">
                {t(`${u}.problem.intro`)}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {problemCards.map(({ icon: Icon, key }) => (
                <div
                  key={key}
                  className="bg-proxio-darker border-proxio-dark-border rounded-2xl border p-8"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-red-50 p-3">
                    <Icon className="h-6 w-6 text-red-500" />
                  </div>
                  <h3 className="text-proxio-text-main mb-2 text-lg font-bold">
                    {t(`${u}.problem.${key}Title`)}
                  </h3>
                  <p className="text-proxio-text-muted text-sm leading-relaxed">
                    {t(`${u}.problem.${key}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Solution */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="bg-proxio-accent overflow-hidden rounded-2xl p-8 text-white md:p-14">
            <span className="text-sm font-semibold tracking-widest uppercase opacity-75">
              {t(`${u}.solution.label`)}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              {t(`${u}.solution.title`)}
            </h2>
            <p className="mt-5 max-w-3xl text-xl leading-relaxed opacity-90">
              {t(`${u}.solution.body`)}
            </p>
          </div>
        </section>

        {/* Platform Overview */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
                {t(`${u}.features.label`)}
              </span>
              <h2 className="text-proxio-text-main mt-3 text-3xl font-extrabold sm:text-4xl">
                {t(`${u}.features.title`)}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {featureGroups.map(({ icon: Icon, key }) => {
                const items = t(`${u}.features.${key}.items`, {
                  returnObjects: true,
                }) as string[];
                return (
                  <div
                    key={key}
                    className="bg-proxio-darker border-proxio-dark-border rounded-2xl border p-8"
                  >
                    <div className="bg-proxio-accent/10 mb-5 inline-flex rounded-xl p-3">
                      <Icon className="text-proxio-accent h-6 w-6" />
                    </div>
                    <h3 className="text-proxio-text-main mb-4 text-xl font-bold">
                      {t(`${u}.features.${key}.title`)}
                    </h3>
                    <ul className="space-y-3">
                      {items.map((item) => (
                        <li key={item} className="text-proxio-text-muted flex gap-2.5 text-sm leading-relaxed">
                          <Check className="text-proxio-accent mt-0.5 h-4 w-4 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Origin Story */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start">
            <div>
              <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
                {t(`${u}.origin.label`)}
              </span>
              <h2 className="text-proxio-text-main mt-3 text-3xl font-extrabold sm:text-4xl">
                {t(`${u}.origin.title`)}
              </h2>
            </div>
            <div className="space-y-5">
              {(['p1', 'p2', 'p3'] as const).map((p) => (
                <p key={p} className="text-proxio-text-muted text-lg leading-relaxed">
                  {t(`${u}.origin.${p}`)}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
                {t(`${u}.stack.label`)}
              </span>
              <h2 className="text-proxio-text-main mt-3 text-3xl font-extrabold sm:text-4xl">
                {t(`${u}.stack.title`)}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {stackItems.map(({ key }) => (
                <div
                  key={key}
                  className="bg-proxio-darker border-proxio-dark-border rounded-2xl border p-8"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-proxio-text-main text-2xl font-black">
                      {t(`${u}.stack.${key}.name`)}
                    </span>
                    <span className="bg-proxio-accent/10 text-proxio-accent rounded-full px-3 py-1 text-xs font-semibold">
                      {t(`${u}.stack.${key}.role`)}
                    </span>
                  </div>
                  <p className="text-proxio-text-muted mt-3 text-sm leading-relaxed">
                    {t(`${u}.stack.${key}.reason`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Vision */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-end">
            <div>
              <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
                {t(`${u}.ai.label`)}
              </span>
              <h2 className="text-proxio-text-main mt-3 text-3xl font-extrabold sm:text-4xl">
                {t(`${u}.ai.title`)}
              </h2>
            </div>
            <p className="text-proxio-text-muted text-lg leading-relaxed">
              {t(`${u}.ai.body`)}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {aiItems.map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="bg-proxio-dark border-proxio-dark-border rounded-2xl border p-8"
              >
                <div className="bg-proxio-accent/10 mb-5 inline-flex rounded-xl p-3">
                  <Icon className="text-proxio-accent h-6 w-6" />
                </div>
                <h3 className="text-proxio-text-main mb-2 text-lg font-bold">
                  {t(`${u}.ai.${key}Title`)}
                </h3>
                <p className="text-proxio-text-muted text-sm leading-relaxed">
                  {t(`${u}.ai.${key}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
                {t(`${u}.roadmap.label`)}
              </span>
              <h2 className="text-proxio-text-main mt-3 text-3xl font-extrabold sm:text-4xl">
                {t(`${u}.roadmap.title`)}
              </h2>
            </div>

            <div className="max-w-xl space-y-4">
              {roadmapSteps.map(({ key, status }, index) => (
                <div key={key} className="flex items-start gap-4">
                  <div className="mt-0.5 shrink-0">
                    {status === 'done' ? (
                      <CheckCircle2 className="text-proxio-accent h-6 w-6" />
                    ) : (
                      <Circle className="text-proxio-dark-border h-6 w-6" />
                    )}
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-4">
                    <span
                      className={`text-base font-medium ${
                        status === 'done'
                          ? 'text-proxio-text-main'
                          : 'text-proxio-text-muted'
                      }`}
                    >
                      {t(`${u}.roadmap.${key}`)}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        status === 'done'
                          ? 'bg-proxio-accent/10 text-proxio-accent'
                          : index === 2
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-proxio-darker text-proxio-text-muted border-proxio-dark-border border'
                      }`}
                    >
                      {status === 'done'
                        ? t(`${u}.roadmap.done`)
                        : index === 2
                          ? t(`${u}.roadmap.next`)
                          : t(`${u}.roadmap.upcoming`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="border-proxio-dark-border bg-proxio-dark rounded-2xl border p-12 text-center">
            <div className="bg-proxio-accent/10 mx-auto mb-6 inline-flex rounded-full p-4">
              <Brain className="text-proxio-accent h-8 w-8" />
            </div>
            <h2 className="text-proxio-text-main text-3xl font-extrabold sm:text-4xl">
              {t(`${u}.cta.title`)}
            </h2>
            <p className="text-proxio-text-muted mx-auto mt-4 max-w-xl text-lg">
              {t(`${u}.cta.body`)}
            </p>
            <Link
              to="/contact"
              className="bg-proxio-accent hover:bg-proxio-accent-hover mt-8 inline-block rounded-lg px-8 py-3.5 text-base font-bold text-white transition-colors"
            >
              {t(`${u}.cta.button`)}
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
