import HeroSection from '@components/home/HeroSection';
import ProcessTimeline from '@components/home/ProcessTimeline';
import ServicesSection from '@components/home/ServicesSection';
import UrbiShowcase from '@components/home/UrbiShowcase';
import CtaSection from '@components/motion/CtaSection';
import SEO, { BASE_URL, SITE_NAME } from '@components/SEO';
import { localizePath } from '@/i18n/paths';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'pt';

  // Tells search engines that "Proxio" and "Proxio Solutions" are this organisation and site,
  // so brand searches show the site name and can build a knowledge panel.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: 'Proxio',
        url: `${BASE_URL}/`,
        logo: `${BASE_URL}/web-app-manifest-512x512.png`,
        email: t('contact.info.email.value'),
        description: t('home.seo.description'),
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: SITE_NAME,
        alternateName: 'Proxio',
        url: `${BASE_URL}${localizePath('/', lang)}`,
        inLanguage: lang === 'en' ? 'en' : 'pt-PT',
        publisher: { '@id': `${BASE_URL}/#organization` },
      },
    ],
  };

  return (
    <>
      <SEO title={t('home.seo.title')} description={t('home.seo.description')} exactTitle />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

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
