import HeroSection from '@components/home/HeroSection';
import ProcessTimeline from '@components/home/ProcessTimeline';
import ServicesSection from '@components/home/ServicesSection';
import UrbiShowcase from '@components/home/UrbiShowcase';
import CtaSection from '@components/motion/CtaSection';
import SEO from '@components/SEO';
import { useTranslation } from 'react-i18next';

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
        <CtaSection
          title={t('home.cta.title')}
          subtitle={t('home.cta.subtitle')}
          primary={{ to: '/contact', label: t('home.cta.button') }}
        />
      </main>
    </>
  );
}
