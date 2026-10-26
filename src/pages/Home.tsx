import HeroSection from '@components/home/HeroSection';
import ProcessTimeline from '@components/home/ProcessTimeline';
import ServicesSection from '@components/home/ServicesSection';
import UrbiShowcase from '@components/home/UrbiShowcase';
import Reveal from '@components/Reveal';
import SEO from '@components/SEO';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('nav.home')} description={t('home.hero.subtitle')} />

      <main>
        <HeroSection />
        <ServicesSection />
        <UrbiShowcase />
        <ProcessTimeline />

        {/* Bottom CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <Reveal>
            <div className="border-proxio-dark-border bg-proxio-dark rounded-2xl border p-12 text-center">
              <h2 className="text-proxio-text-main text-3xl font-extrabold sm:text-4xl">
                {t('home.cta.title')}
              </h2>
              <p className="text-proxio-text-muted mt-4 text-lg">{t('home.cta.subtitle')}</p>
              <Link
                to="/contact"
                className="bg-proxio-accent hover:bg-proxio-accent-hover shadow-proxio-accent/25 mt-8 inline-block rounded-lg px-8 py-3.5 text-base font-bold text-white shadow-lg transition-colors"
              >
                {t('home.cta.button')}
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
