import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SectionHeader from '@components/motion/SectionHeader';
import { revealServiceCards, serviceIllustrations } from './serviceCards';

const serviceKeys = ['web', 'mobile', 'consulting'] as const;

export default function ServicesSection() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        revealServiceCards(gsap.utils.toArray<HTMLElement>('.service-card'));
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-proxio-dark border-proxio-dark-border border-y py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="01"
          label={t('home.services.label')}
          title={t('home.services.title')}
          subtitle={t('home.services.subtitle')}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {serviceKeys.map((key, i) => {
            const Illustration = serviceIllustrations[key];
            return (
              <div key={key} className="service-card">
                <Link viewTransition
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
