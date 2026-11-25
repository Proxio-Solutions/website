import { revealServiceCards, serviceIllustrations } from '@components/home/serviceCards';
import ProcessTimeline from '@components/home/ProcessTimeline';
import CtaSection from '@components/motion/CtaSection';
import PageHero from '@components/motion/PageHero';
import SectionLabel from '@components/motion/SectionLabel';
import SpotlightCard from '@components/motion/SpotlightCard';
import SEO from '@components/SEO';
import { gsap, motion, MOTION_OK, useGSAP } from '@/lib/gsap';
import { Link } from '@components/LocalizedLink';
import { ArrowRight, Check } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

const serviceKeys = ['web', 'mobile', 'consulting'] as const;

/**
 * Where each card's action leads: the brief with the matching project type already chosen.
 * Web stays open, because the brief asks whether it is a website or a web app.
 */
const briefLinks: Record<(typeof serviceKeys)[number], string> = {
  web: '/contact',
  mobile: '/contact?type=mobile',
  consulting: '/contact?type=consulting',
};

export default function Services() {
  const { t } = useTranslation();
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
      <SEO title={t('services.seo.title')} description={t('services.seo.description')} />

      <main>
        <PageHero
          label={t('services.hero.label')}
          title={t('services.hero.title')}
          highlights={t('services.hero.highlights', { returnObjects: true }) as string[]}
          subtitle={t('services.hero.subtitle')}
        />

        {/* Service cards */}
        <section className="bg-proxio-dark border-proxio-dark-border border-y py-24">
          <div ref={cardsRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* The hero already makes the claim: a quiet heading here, not a second display title */}
            <h2 className="mb-10">
              <SectionLabel index="01">{t('home.services.label')}</SectionLabel>
            </h2>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {serviceKeys.map((key) => {
                const Illustration = serviceIllustrations[key];
                const features = t(`services.items.${key}.features`, {
                  returnObjects: true,
                }) as string[];
                return (
                  // The anchor sits on a wrapper the entrance animation never moves, so links land exactly
                  <div key={key} id={`service-${key}`}>
                    <div className="service-card h-full">
                      <SpotlightCard className="group bg-proxio-darker border-proxio-dark-border flex h-full flex-col rounded-2xl border p-6 sm:p-8">
                        <div
                          className="bg-proxio-dark border-proxio-dark-border mb-6 h-28 rounded-xl border p-4 sm:h-44"
                          aria-hidden="true"
                        >
                          <Illustration />
                        </div>
                        <h3 className="text-proxio-text-main mb-4 text-2xl font-bold">
                          {t(`services.items.${key}.title`)}
                        </h3>
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
                        <Link
                          viewTransition
                          to={briefLinks[key]}
                          className="text-proxio-accent hover:text-proxio-accent-hover group/cta mt-4 inline-flex w-max items-center gap-1.5 py-3 text-sm font-bold"
                        >
                          {t('services.cardCta')}
                          {/* Three links share the visible label: name the service for screen readers */}
                          <span className="sr-only">: {t(`services.items.${key}.title`)}</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
                        </Link>
                      </SpotlightCard>
                    </div>
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
