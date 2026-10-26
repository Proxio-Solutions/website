import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { Code2, PenTool, Rocket, Search } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeader from '@components/motion/SectionHeader';

const steps = [
  { key: 'discover', icon: Search },
  { key: 'design', icon: PenTool },
  { key: 'build', icon: Code2 },
  { key: 'launch', icon: Rocket },
] as const;

export default function ProcessTimeline({ index = '03' }: { index?: string }) {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          '.process-line-fill',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.process-track',
              start: 'top 60%',
              end: 'bottom 60%',
              scrub: 0.4,
            },
          },
        );

        gsap.utils.toArray<HTMLElement>('.process-step').forEach((step) => {
          // On mobile every card sits right of the track, so they all slide in from the right
          const fromLeft =
            step.dataset.side === 'left' && window.matchMedia('(min-width: 1024px)').matches;
          gsap.from(step.querySelector('.process-card'), {
            x: fromLeft ? -48 : 48,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 75%' },
          });
          gsap.to(step, {
            scrollTrigger: { trigger: step, start: 'top 60%', toggleClass: 'is-active' },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="mx-auto max-w-7xl overflow-x-clip px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeader
        index={index}
        label={t('services.process.label')}
        title={t('services.process.title')}
        align="center"
        className="mb-16"
      />

      <ol className="process-track relative">
        {/* Track: left edge on mobile, centred on desktop */}
        <div
          className="bg-proxio-dark-border absolute top-0 bottom-0 left-5 w-px lg:left-1/2"
          aria-hidden="true"
        >
          <div className="process-line-fill bg-proxio-accent h-full w-full origin-top" />
        </div>

        {steps.map(({ key, icon: Icon }, i) => {
          const left = i % 2 === 0;
          return (
            <li
              key={key}
              data-side={left ? 'left' : 'right'}
              className="process-step relative grid grid-cols-[2.5rem_1fr] gap-6 pb-14 last:pb-0 lg:grid-cols-[1fr_2.5rem_1fr] lg:gap-10"
            >
              <div
                className={`process-card col-start-2 row-start-1 ${left ? 'lg:col-start-1 lg:text-right' : 'lg:col-start-3'}`}
              >
                <span className="text-proxio-accent font-mono text-xs tracking-widest">
                  0{i + 1}
                </span>
                <h3 className="text-proxio-text-main mt-1 text-2xl font-bold">
                  {t(`services.process.${key}.title`)}
                </h3>
                <p
                  className={`text-proxio-text-muted mt-2 leading-relaxed lg:max-w-sm ${left ? 'lg:ml-auto' : ''}`}
                >
                  {t(`services.process.${key}.desc`)}
                </p>
              </div>
              <div className="col-start-1 row-start-1 lg:col-start-2">
                <span className="process-node border-proxio-dark-border bg-proxio-darker text-proxio-text-muted relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
