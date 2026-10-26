import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SectionLabel from './SectionLabel';

/* Line illustrations: `svc-draw` strokes are drawn in on scroll, `svc-pop` shapes pop in. */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  pathLength: 1,
} as const;

function WebIllustration() {
  return (
    <svg viewBox="0 0 200 130" className="h-full w-full">
      <g className="text-slate-300">
        <rect className="svc-draw" x="20" y="12" width="160" height="106" rx="8" {...stroke} />
        <path className="svc-draw" d="M20 30H180" {...stroke} />
        <path className="svc-draw" d="M34 60H120M34 68H100" {...stroke} />
        <rect className="svc-draw" x="34" y="82" width="38" height="24" rx="3" {...stroke} />
        <rect className="svc-draw" x="130" y="82" width="38" height="24" rx="3" {...stroke} />
      </g>
      <g className="text-proxio-accent">
        {[31, 39, 47].map((cx) => (
          <circle key={cx} className="svc-pop" cx={cx} cy="21" r="2.2" fill="currentColor" />
        ))}
        <rect
          className="svc-pop svc-bar"
          x="34"
          y="42"
          width="70"
          height="9"
          rx="2"
          fill="currentColor"
        />
        <rect className="svc-draw" x="82" y="82" width="38" height="24" rx="3" {...stroke} />
      </g>
    </svg>
  );
}

function MobileIllustration() {
  return (
    <svg viewBox="0 0 200 130" className="h-full w-full">
      <g className="text-slate-300">
        <rect className="svc-draw" x="72" y="8" width="56" height="114" rx="10" {...stroke} />
        <path className="svc-draw" d="M93 16H107" {...stroke} />
        <path className="svc-draw" d="M82 60H118M82 68H108" {...stroke} />
      </g>
      <g className="text-proxio-accent">
        <rect className="svc-pop" x="82" y="28" width="36" height="22" rx="3" fill="currentColor" />
        <rect className="svc-draw" x="82" y="98" width="36" height="12" rx="4" {...stroke} />
        <path
          className="svc-draw svc-wave"
          d="M60 52Q52 65 60 78M140 52Q148 65 140 78"
          {...stroke}
        />
        <path
          className="svc-draw svc-wave svc-wave-2"
          d="M50 44Q38 65 50 86M150 44Q162 65 150 86"
          {...stroke}
        />
      </g>
    </svg>
  );
}

const satellites = [
  [40, 30],
  [160, 30],
  [28, 96],
  [172, 96],
  [100, 14],
  [100, 116],
] as const;

function ConsultingIllustration() {
  return (
    <svg viewBox="0 0 200 130" className="h-full w-full">
      <g className="text-slate-300">
        {satellites.map(([x, y]) => (
          <path key={`l${x}${y}`} className="svc-draw" d={`M100 65L${x} ${y}`} {...stroke} />
        ))}
        {satellites.map(([x, y]) => (
          <circle
            key={`c${x}${y}`}
            className="svc-pop svc-node"
            cx={x}
            cy={y}
            r="6"
            fill="white"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
      </g>
      <g className="text-proxio-accent">
        <circle
          className="svc-ring"
          cx="100"
          cy="65"
          r="17"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.35"
        />
        <circle className="svc-pop" cx="100" cy="65" r="10" fill="currentColor" />
      </g>
    </svg>
  );
}

const services = [
  { key: 'web', Illustration: WebIllustration },
  { key: 'mobile', Illustration: MobileIllustration },
  { key: 'consulting', Illustration: ConsultingIllustration },
] as const;

export default function ServicesSection() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('.service-card').forEach((card, i) => {
          gsap
            .timeline({ scrollTrigger: { trigger: card, start: 'top 82%' }, delay: i * 0.12 })
            .from(card, { y: 48, opacity: 0, duration: 0.8, ease: 'power3.out' })
            .fromTo(
              card.querySelectorAll('.svc-draw'),
              { strokeDasharray: 1, strokeDashoffset: 1 },
              { strokeDashoffset: 0, duration: 1, stagger: 0.06, ease: 'power2.inOut' },
              '-=0.4',
            )
            .from(
              card.querySelectorAll('.svc-pop'),
              {
                scale: 0,
                transformOrigin: '50% 50%',
                duration: 0.5,
                stagger: 0.05,
                ease: 'back.out(2)',
              },
              '-=0.7',
            );
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-proxio-dark border-proxio-dark-border border-y py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-3xl">
          <SectionLabel index="01">{t('home.services.label')}</SectionLabel>
          <h2 className="text-proxio-text-main mt-3 text-3xl font-extrabold sm:text-5xl">
            {t('home.services.title')}
          </h2>
          <p className="text-proxio-text-muted mt-4 text-lg leading-relaxed">
            {t('home.services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {services.map(({ key, Illustration }, i) => (
            <div key={key} className="service-card">
              <Link
                to="/services"
                className="card-lift group bg-proxio-darker border-proxio-dark-border flex h-full flex-col rounded-2xl border p-6"
              >
                <div
                  className="bg-proxio-dark border-proxio-dark-border mb-6 h-40 rounded-xl border p-4"
                  aria-hidden="true"
                >
                  <Illustration />
                </div>
                <span className="text-proxio-text-muted font-mono text-xs">[0{i + 1}]</span>
                <h3 className="text-proxio-text-main mt-1 text-xl font-bold">
                  {t(`home.services.${key}.title`)}
                </h3>
                <p className="text-proxio-text-muted mt-2 flex-1 leading-relaxed">
                  {t(`home.services.${key}.desc`)}
                </p>
                <span className="text-proxio-accent mt-6 inline-flex items-center gap-1.5 text-sm font-bold">
                  {t('home.services.cta')}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
