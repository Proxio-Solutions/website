import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { scrollToTarget } from '@/lib/smoothScroll';
import { ArrowRight, MousePointer2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import CountUp from '@components/motion/CountUp';
import SectionLabel from '@components/motion/SectionLabel';
import { urbiScreens } from './UrbiScreens';

const caseStudyUrbiEnabled = import.meta.env.VITE_ENABLE_CASE_STUDY_URBI === 'true';

const steps = ['report', 'manage', 'resolve'] as const;
const stats = ['stat1', 'stat2', 'stat3', 'stat4'] as const;

export default function UrbiShowcase() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const cs = 'caseStudies.urbi';

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        const screens = gsap.utils.toArray<HTMLElement>('.urbi-screen-d');
        gsap.set(screens.slice(1), { autoAlpha: 0, yPercent: 12, scale: 0.94 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.urbi-stage',
            start: 'top top',
            end: '+=220%',
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => {
              const index = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
              if (index !== activeRef.current) {
                activeRef.current = index;
                setActive(index);
              }
            },
          },
        });
        trigger.current = tl.scrollTrigger ?? null;

        tl.fromTo('.urbi-progress', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: 3 }, 0);
        // Swap screens right at each step boundary (i + 1) so they line up with the active step
        screens.slice(1).forEach((screen, i) => {
          tl.to(
            screens[i],
            { autoAlpha: 0, yPercent: -8, scale: 0.94, duration: 0.15, ease: 'power1.in' },
            i + 0.85,
          );
          tl.to(
            screen,
            { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.25, ease: 'power2.out' },
            i + 1,
          );
        });

        return () => {
          trigger.current = null;
        };
      });

      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('.urbi-stack-item').forEach((item) => {
          gsap.from(item, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 85%' },
          });
        });
      });
    },
    { scope: root },
  );

  const goToStep = (index: number) => {
    const st = trigger.current;
    if (!st) return;
    const y = st.start + (st.end - st.start) * ((index + 0.5) / steps.length);
    scrollToTarget(y);
  };

  const intro = (
    <>
      <SectionLabel index="02" className="!text-blue-400">
        {t('home.featured.label')}
      </SectionLabel>
      <div className="mt-4 flex items-center gap-4">
        <h2 className="text-6xl font-black tracking-tight sm:text-7xl">Urbi</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-400" />
          </span>
          {t('projects.status.development')}
        </span>
      </div>
      <p className="mt-5 text-2xl font-bold text-white/90">{t(`${cs}.solution.title`)}</p>
      <p className="mt-3 max-w-xl leading-relaxed text-white/60">{t(`${cs}.hero.subtitle`)}</p>
    </>
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-[#0b1120] text-white">
      <div className="urbi-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Desktop: pinned, scroll-driven walkthrough */}
      <div className="hidden motion-safe:lg:block">
        <div className="urbi-stage relative flex h-screen items-center">
          <div className="relative mx-auto grid w-full max-w-7xl grid-cols-2 items-center gap-16 px-8">
            <div>
              {intro}

              <ol className="mt-10 space-y-2">
                {steps.map((step, i) => (
                  <li key={step}>
                    <button
                      type="button"
                      onClick={() => goToStep(i)}
                      aria-current={active === i ? 'step' : undefined}
                      className={`flex w-full gap-5 rounded-xl border p-4 text-left transition-all duration-500 ${
                        active === i
                          ? 'border-blue-400/30 bg-white/[0.06] opacity-100'
                          : 'border-transparent opacity-40 hover:opacity-70'
                      }`}
                    >
                      <span className="font-mono text-sm text-blue-400">0{i + 1}</span>
                      <span>
                        <span className="block text-lg font-bold">
                          {t(`home.urbi.steps.${step}.title`)}
                        </span>
                        <span
                          className={`grid transition-all duration-500 ${active === i ? 'mt-1 grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                        >
                          <span className="overflow-hidden text-sm leading-relaxed text-white/60">
                            {t(`home.urbi.steps.${step}.desc`)}
                          </span>
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>

              <div className="mt-8 h-px w-full bg-white/10">
                <div className="urbi-progress h-px origin-left bg-blue-400" />
              </div>
              <p className="mt-4 flex items-center gap-2 font-mono text-xs text-white/40">
                <MousePointer2 className="h-3.5 w-3.5" />
                {t('home.urbi.scrollHint')}
              </p>
            </div>

            <div className="relative h-[560px]" aria-hidden="true">
              <div className="absolute inset-10 rounded-full bg-blue-600/20 blur-3xl" />
              {urbiScreens.map((Screen, i) => (
                <div
                  key={i}
                  className="urbi-screen-d absolute inset-0 flex items-center justify-center"
                >
                  <Screen />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile and reduced motion: stacked steps */}
      <div className="urbi-stack relative mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 motion-safe:lg:hidden">
        <div className="urbi-stack-item">{intro}</div>
        <ol className="mt-12 grid grid-cols-1 gap-14 lg:grid-cols-3 lg:gap-8">
          {steps.map((step, i) => {
            const Screen = urbiScreens[i];
            return (
              <li key={step} className="urbi-stack-item min-w-0">
                <span className="font-mono text-sm text-blue-400">0{i + 1}</span>
                <h3 className="mt-1 text-xl font-bold">{t(`home.urbi.steps.${step}.title`)}</h3>
                <p className="mt-2 leading-relaxed text-white/60">
                  {t(`home.urbi.steps.${step}.desc`)}
                </p>
                <div className="mt-6 flex justify-center" aria-hidden="true">
                  <Screen />
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Stats + CTA */}
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {stats.map((stat) => {
            const value = t(`${cs}.hero.${stat}Value`);
            return (
              <div key={stat} className="bg-[#0b1120] p-6 sm:p-8">
                <dt className="font-mono text-xs tracking-wider text-white/50 uppercase">
                  {t(`${cs}.hero.${stat}Label`)}
                </dt>
                <dd className="mt-2 text-2xl font-extrabold sm:text-3xl">
                  <CountUp value={value} suffixClassName="text-blue-400" />
                </dd>
              </div>
            );
          })}
        </dl>

        <div className="mt-10 flex justify-center">
          <Link
            to={caseStudyUrbiEnabled ? '/case-studies/urbi' : '/projects'}
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-bold text-slate-900 transition-colors hover:bg-blue-50"
          >
            {caseStudyUrbiEnabled ? t('projects.viewCaseStudy') : t('home.hero.learnMore')}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
