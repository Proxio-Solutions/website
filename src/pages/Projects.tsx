import urbiLogo from '@/assets/urbi-logo.svg';
import HighlightedText from '@/components/HighlightedText';
import Reveal from '@/components/Reveal';
import SEO from '@/components/SEO';
import { URBI_WEBSITE_URL } from '@/config/links';
import { getFeaturedProject } from '@/services/projectService';
import { ArrowUpRight, FlaskConical, Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const caseStudyUrbiEnabled = import.meta.env.VITE_ENABLE_CASE_STUDY_URBI === 'true';

const headlineHighlights: Record<string, string[]> = {
  pt: ['Ideia', 'Produto'],
  en: ['Idea', 'Product'],
};

export default function Projects() {
  const { t, i18n } = useTranslation();
  const featuredProject = getFeaturedProject();

  return (
    <>
      <SEO title={t('projects.title')} description={t('projects.description')} />

      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Page Header */}
        <Reveal className="mb-16 max-w-2xl">
          <span className="text-proxio-accent text-sm font-semibold tracking-widest uppercase">
            {t('projects.title')}
          </span>
          <h1 className="text-proxio-text-main mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            <HighlightedText
              text={t('projects.headline')}
              words={headlineHighlights[i18n.language] ?? headlineHighlights.en}
            />
          </h1>
          <p className="text-proxio-text-muted mt-4 text-lg leading-relaxed">
            {t('projects.description')}
          </p>
        </Reveal>

        {/* Featured Project — Urbi */}
        <section className="mb-24">
          <div className="text-proxio-accent mb-6 flex items-center gap-2">
            <Rocket className="h-4 w-4" />
            <h2 className="text-xs font-bold tracking-widest uppercase">
              {t('projects.featured')}
            </h2>
          </div>

          <div className="bg-proxio-dark border-proxio-dark-border card-lift overflow-hidden rounded-2xl border">
            <div className="flex flex-col md:flex-row">
              {/* Left — content */}
              <div className="flex flex-col justify-center p-8 md:w-3/5 md:p-12">
                <div className="bg-proxio-darker text-proxio-accent border-proxio-dark-border mb-6 inline-flex w-max items-center rounded-full border px-3 py-1 text-xs font-medium">
                  <span className="relative mr-2 flex h-2 w-2">
                    <span className="bg-proxio-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                    <span className="bg-proxio-accent relative inline-flex h-2 w-2 rounded-full"></span>
                  </span>
                  {t(`projects.status.${featuredProject.status}`)}
                </div>

                <h3 className="text-proxio-text-main mb-4 text-4xl font-extrabold">
                  {featuredProject.title}
                </h3>
                <p className="text-proxio-text-muted mb-8 text-lg leading-relaxed">
                  {t(featuredProject.descriptionKey)}
                </p>

                <div className="mb-8 flex flex-wrap gap-2">
                  {featuredProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-proxio-darker text-proxio-text-muted border-proxio-dark-border rounded-md border px-3 py-1 text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {caseStudyUrbiEnabled && (
                    <Link
                      to="/case-studies/urbi"
                      className="bg-proxio-accent hover:bg-proxio-accent-hover inline-flex w-max items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold text-white transition-colors"
                    >
                      {t('projects.viewCaseStudy')} →
                    </Link>
                  )}
                  <a
                    href={URBI_WEBSITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-proxio-dark-border text-proxio-text-main hover:border-proxio-accent hover:text-proxio-accent group inline-flex w-max items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-bold transition-colors"
                  >
                    {t('caseStudies.urbi.hero.visitSite')}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>

              {/* Right — logo */}
              <div
                className="border-proxio-dark-border relative flex min-h-56 items-center justify-center overflow-hidden border-t p-12 md:w-2/5 md:border-t-0 md:border-l"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
                }}
              >
                <img
                  src={urbiLogo}
                  alt="Urbi"
                  className="max-h-40 w-full max-w-xs object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What's Next */}
        <section>
          <div className="text-proxio-text-muted mb-6 flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            <h2 className="text-xs font-bold tracking-widest uppercase">
              {t('projects.next.label')}
            </h2>
          </div>

          <div className="bg-proxio-dark border-proxio-dark-border rounded-2xl border p-8 md:p-12">
            <h3 className="text-proxio-text-main mb-4 text-3xl font-extrabold">
              {t('projects.next.title')}
            </h3>
            <p className="text-proxio-text-muted mb-8 text-lg leading-relaxed">
              {t('projects.next.desc')}
            </p>
            <Link
              to="/contact"
              className="bg-proxio-accent hover:bg-proxio-accent-hover inline-flex w-max items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold text-white transition-colors"
            >
              {t('projects.next.cta')} →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
