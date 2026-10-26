import urbiLogo from '@/assets/urbi-logo.svg';
import Magnetic from '@/components/motion/Magnetic';
import PageHero from '@/components/motion/PageHero';
import SectionLabel from '@/components/motion/SectionLabel';
import SpotlightCard from '@/components/motion/SpotlightCard';
import Reveal from '@/components/Reveal';
import SEO from '@/components/SEO';
import { URBI_WEBSITE_URL } from '@/config/links';
import { FINE_POINTER, gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { getFeaturedProject } from '@/services/projectService';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const caseStudyUrbiEnabled = import.meta.env.VITE_ENABLE_CASE_STUDY_URBI === 'true';

const headlineHighlights: Record<string, string[]> = {
  pt: ['Ideia', 'Produto'],
  en: ['Idea', 'Product'],
};

/** Dots orbiting a seed: the "ideas in incubation" visual. */
function IncubationOrbit() {
  return (
    <div className="relative h-48 w-48 shrink-0" aria-hidden="true">
      <div className="border-proxio-dark-border absolute inset-0 rounded-full border border-dashed" />
      <div className="border-proxio-dark-border absolute inset-8 rounded-full border border-dashed" />
      <div className="orbit absolute inset-0">
        <span className="bg-proxio-accent absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_12px] shadow-blue-500/60" />
        <span className="absolute bottom-[14%] left-[7%] h-2 w-2 rounded-full bg-blue-300" />
      </div>
      <div className="orbit-reverse absolute inset-8">
        <span className="absolute top-1/2 right-0 h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400" />
      </div>
      <div className="from-proxio-accent absolute top-1/2 left-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br to-blue-400 shadow-lg shadow-blue-600/30" />
    </div>
  );
}

export default function Projects() {
  const { t, i18n } = useTranslation();
  const featuredProject = getFeaturedProject();
  const tiltRef = useRef<HTMLDivElement>(null);

  // Logo tilts in 3D towards the pointer
  useGSAP(
    () => {
      gsap.matchMedia().add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const panel = tiltRef.current;
        const logo = panel?.querySelector('img');
        if (!panel || !logo) return;
        const rotX = gsap.quickTo(logo, 'rotationX', { duration: 0.6, ease: 'power3.out' });
        const rotY = gsap.quickTo(logo, 'rotationY', { duration: 0.6, ease: 'power3.out' });

        const onMove = (e: PointerEvent) => {
          const rect = panel.getBoundingClientRect();
          rotY(((e.clientX - rect.left) / rect.width - 0.5) * 24);
          rotX(-((e.clientY - rect.top) / rect.height - 0.5) * 24);
        };
        const onLeave = () => {
          rotX(0);
          rotY(0);
        };
        gsap.set(logo, { transformPerspective: 700 });
        panel.addEventListener('pointermove', onMove);
        panel.addEventListener('pointerleave', onLeave);
        return () => {
          panel.removeEventListener('pointermove', onMove);
          panel.removeEventListener('pointerleave', onLeave);
        };
      });
    },
    { scope: tiltRef },
  );

  return (
    <>
      <SEO title={t('projects.title')} description={t('projects.description')} />

      <main>
        <PageHero
          label={t('projects.title')}
          title={t('projects.headline')}
          highlights={headlineHighlights[i18n.language] ?? headlineHighlights.en}
          subtitle={t('projects.description')}
          align="left"
        />

        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          {/* Featured Project — Urbi */}
          <section className="mb-24">
            <Reveal>
              <SectionLabel index="01" className="mb-6">
                {t('projects.featured')}
              </SectionLabel>
            </Reveal>

            <Reveal>
              <SpotlightCard className="bg-proxio-dark border-proxio-dark-border overflow-hidden rounded-3xl border">
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

                    <h2 className="text-proxio-text-main mb-4 text-5xl font-black tracking-tight">
                      {featuredProject.title}
                    </h2>
                    <p className="text-proxio-text-muted mb-8 text-lg leading-relaxed">
                      {t(featuredProject.descriptionKey)}
                    </p>

                    <div className="mb-8 flex flex-wrap gap-2">
                      {featuredProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-proxio-darker text-proxio-text-muted border-proxio-dark-border rounded-md border px-3 py-1 font-mono text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {caseStudyUrbiEnabled && (
                        <Magnetic>
                          <Link
                            to="/case-studies/urbi"
                            className="group bg-proxio-accent hover:bg-proxio-accent-hover inline-flex w-max items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-colors"
                          >
                            {t('projects.viewCaseStudy')}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Magnetic>
                      )}
                      <a
                        href={URBI_WEBSITE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-proxio-dark-border text-proxio-text-main hover:border-proxio-accent hover:text-proxio-accent group inline-flex w-max items-center gap-2 rounded-lg border px-6 py-3 text-sm font-bold transition-colors"
                      >
                        {t('caseStudies.urbi.hero.visitSite')}
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>

                  {/* Right — logo, tilts towards the pointer */}
                  <div
                    ref={tiltRef}
                    className="border-proxio-dark-border relative flex min-h-64 items-center justify-center overflow-hidden border-t p-12 md:w-2/5 md:border-t-0 md:border-l"
                    style={{
                      background:
                        'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.14) 0%, transparent 70%)',
                    }}
                  >
                    <div
                      className="hero-grid pointer-events-none absolute inset-0"
                      aria-hidden="true"
                    />
                    <div className="float relative w-full max-w-xs">
                      <img
                        src={urbiLogo}
                        alt="Urbi"
                        className="max-h-40 w-full object-contain drop-shadow-[0_20px_30px_rgb(37_99_235/0.25)]"
                      />
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          </section>

          {/* What's Next */}
          <section>
            <Reveal>
              <SectionLabel index="02" className="!text-proxio-text-muted mb-6">
                {t('projects.next.label')}
              </SectionLabel>
            </Reveal>

            <Reveal>
              <div className="border-proxio-dark-border flex flex-col items-center gap-10 rounded-3xl border border-dashed p-8 md:flex-row md:p-12">
                <IncubationOrbit />
                <div>
                  <h2 className="text-proxio-text-main mb-4 text-3xl font-extrabold">
                    {t('projects.next.title')}
                  </h2>
                  <p className="text-proxio-text-muted mb-8 text-lg leading-relaxed">
                    {t('projects.next.desc')}
                  </p>
                  <Magnetic>
                    <Link
                      to="/contact"
                      className="group bg-proxio-accent hover:bg-proxio-accent-hover inline-flex w-max items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-colors"
                    >
                      {t('projects.next.cta')}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Magnetic>
                </div>
              </div>
            </Reveal>
          </section>
        </div>
      </main>
    </>
  );
}
