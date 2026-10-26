import { revealServiceCards, serviceIllustrations } from '@components/home/ServicesSection';
import ProcessTimeline from '@components/home/ProcessTimeline';
import CtaSection from '@components/motion/CtaSection';
import PageHero from '@components/motion/PageHero';
import SectionHeader from '@components/motion/SectionHeader';
import SpotlightCard from '@components/motion/SpotlightCard';
import SEO from '@components/SEO';
import { gsap, motion, MOTION_OK, useGSAP } from '@/lib/gsap';
import { Check } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

const serviceKeys = ['web', 'mobile', 'consulting'] as const;

const heroHighlights: Record<string, string[]> = {
  pt: ['Ideias', 'Software'],
  en: ['Ideas', 'Software'],
};

export default function Services() {
  const { t, i18n } = useTranslation();
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        revealServiceCards(gsap.utils.toArray<HTMLElement>('.service-card'));
        gsap.utils.toArray<HTMLElement>('.service-card').forEach((card) => {
          gsap.from(card.querySelectorAll('.feature-item'), {
            x: -12,
            opacity: 0,
            duration: motion.duration.fast,
            stagger: motion.stagger.normal,
            ease: motion.ease.out,
            scrollTrigger: { trigger: card, start: 'top 70%' },
          });
        });
      });
    },
    { scope: cardsRef },
  );

  return (
    <>
      <SEO title={t('services.title')} description={t('services.hero.subtitle')} />

      <main>
        <PageHero
          label={t('services.hero.label')}
          title={t('services.hero.title')}
          highlights={heroHighlights[i18n.language] ?? heroHighlights.en}
          subtitle={t('services.hero.subtitle')}
        />

        {/* Service cards */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-24">
          <div ref={cardsRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              index="01"
              label={t('home.services.label')}
              title={t('home.services.title')}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {serviceKeys.map((key, index) => {
                const Illustration = serviceIllustrations[key];
                const features = t(`services.items.${key}.features`, {
                  returnObjects: true,
                }) as string[];
                return (
                  <div key={key} id={`service-${key}`} className="service-card scroll-mt-28">
                    <SpotlightCard className="group bg-proxio-darker border-proxio-dark-border flex h-full flex-col rounded-2xl border p-6 sm:p-8">
                      <div
                        className="bg-proxio-dark border-proxio-dark-border mb-6 h-44 rounded-xl border p-4"
                        aria-hidden="true"
                      >
                        <Illustration />
                      </div>
                      <span className="text-proxio-text-muted font-mono text-xs">
                        [0{index + 1}]
                      </span>
                      <h2 className="text-proxio-text-main mt-1 mb-4 text-2xl font-bold">
                        {t(`services.items.${key}.title`)}
                      </h2>
                      <p className="text-proxio-text-muted mb-6 leading-relaxed">
                        {t(`services.items.${key}.desc`)}
                      </p>
                      <ul className="border-proxio-dark-border mt-auto space-y-3 border-t pt-6">
                        {features.map((feature) => (
                          <li
                            key={feature}
                            className="feature-item text-proxio-text-main flex items-center gap-3 text-sm font-medium"
                          >
                            <span className="bg-proxio-accent/10 text-proxio-accent flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                              <Check className="h-3 w-3" />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </SpotlightCard>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <ProcessTimeline index="02" />

        <CtaSection
          title={t('services.cta.title')}
          subtitle={t('services.cta.subtitle')}
          primary={{ to: '/contact', label: t('services.cta.button') }}
        />
      </main>
    </>
  );
}
