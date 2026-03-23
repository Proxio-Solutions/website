import SEO from '@/components/SEO';
import { getFeaturedProject } from '@/services/projectService';
import { Code2, Rocket, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Projects() {
  const { t } = useTranslation();
  const featuredProject = getFeaturedProject();

  return (
    <>
      <SEO title={t('projects.title')} description={t('projects.description')} />

      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-proxio-text-main text-4xl font-extrabold tracking-tight sm:text-5xl">
            {t('projects.title')}
          </h1>
          <p className="text-proxio-text-muted mt-4 max-w-2xl text-lg">
            {t('projects.description')}
          </p>
        </div>

        {/* Featured Project — Urbi */}
        <section className="mb-20">
          <div className="text-proxio-accent mb-6 flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            <h2 className="text-sm font-bold tracking-widest uppercase">
              {t('projects.featured')}
            </h2>
          </div>

          <div className="bg-proxio-dark border-proxio-dark-border flex flex-col gap-10 rounded-2xl border p-8 md:flex-row md:p-12">
            <div className="flex flex-col justify-center md:w-1/2">
              {/* Status Badge */}
              <div className="bg-proxio-darker text-proxio-accent border-proxio-dark-border mb-5 inline-flex w-max items-center rounded-full border px-3 py-1 text-xs font-medium">
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

              <div className="flex flex-wrap gap-2">
                {featuredProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-proxio-darker text-proxio-text-muted border-proxio-dark-border rounded-md border px-3 py-1 text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                to="/case-studies/urbi"
                className="text-proxio-accent hover:text-proxio-accent-hover mt-6 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
              >
                {t('projects.viewCaseStudy')} →
              </Link>
            </div>

            <div className="bg-proxio-darker border-proxio-dark-border flex min-h-64 items-center justify-center rounded-xl border md:w-1/2">
              <Code2 className="text-proxio-dark-border h-20 w-20 opacity-40" />
            </div>
          </div>
        </section>

        {/* What's Next */}
        <section>
          <div className="text-proxio-text-muted mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-sm font-bold tracking-widest uppercase">
              {t('projects.next.label')}
            </h2>
          </div>

          <div className="border-proxio-dark-border bg-proxio-dark rounded-2xl border p-8 md:p-12">
            <div className="flex flex-col gap-10 md:flex-row md:items-center">
              <div className="md:w-2/3">
                <h3 className="text-proxio-text-main mb-4 text-3xl font-extrabold">
                  {t('projects.next.title')}
                </h3>
                <p className="text-proxio-text-muted text-lg leading-relaxed">
                  {t('projects.next.desc')}
                </p>
              </div>

              <div className="md:w-1/3">
                <div className="border-proxio-dark-border rounded-xl border border-dashed p-8 text-center">
                  <Sparkles className="text-proxio-dark-border mx-auto mb-3 h-8 w-8" />
                  <p className="text-proxio-text-muted text-sm">{t('projects.next.placeholder')}</p>
                </div>
              </div>
            </div>

            <div className="border-proxio-dark-border mt-8 border-t pt-8">
              <Link
                to="/contact"
                className="bg-proxio-accent hover:bg-proxio-accent-hover inline-block rounded-lg px-6 py-2.5 text-sm font-bold text-white transition-colors"
              >
                {t('projects.next.cta')} →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
