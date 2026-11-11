declare global {
  interface Window {
    plausible?: (event: string) => void;
  }
}

import ProjectBrief from '@components/contact/ProjectBrief';
import PageHero from '@components/motion/PageHero';
import SpotlightCard from '@components/motion/SpotlightCard';
import Reveal from '@components/Reveal';
import SEO from '@components/SEO';
import { Clock, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const heroHighlights: Record<string, string[]> = {
  pt: ['Vamos Falar', 'Teu Projeto'],
  en: ["Let's Talk", 'Your Project'],
};

export default function Contact() {
  const { t, i18n } = useTranslation();
  const infoCards = [
    { icon: Mail, label: t('contact.info.email.label'), value: t('contact.info.email.value') },
    {
      icon: MapPin,
      label: t('contact.info.location.label'),
      value: t('contact.info.location.value'),
    },
    {
      icon: Clock,
      label: t('contact.info.response.label'),
      value: t('contact.info.response.value'),
    },
  ];

  return (
    <>
      <SEO title={t('contact.title')} description={t('contact.hero.subtitle')} />

      <main>
        <PageHero
          label={t('contact.hero.label')}
          title={t('contact.hero.title')}
          highlights={heroHighlights[i18n.language] ?? heroHighlights.en}
          subtitle={t('contact.hero.subtitle')}
        />

        {/* Brief + Info */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <Reveal>
            <ProjectBrief
              aside={infoCards.map(({ icon: Icon, label, value }) => (
                <SpotlightCard
                  key={label}
                  className="group bg-proxio-dark border-proxio-dark-border rounded-2xl border p-6"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="bg-proxio-accent/10 group-hover:bg-proxio-accent rounded-lg p-2 transition-colors duration-300">
                      <Icon className="text-proxio-accent h-5 w-5 transition-colors duration-300 group-hover:text-white" />
                    </div>
                    <span className="text-proxio-text-muted font-mono text-xs tracking-wider uppercase">
                      {label}
                    </span>
                  </div>
                  <p className="text-proxio-text-main font-semibold break-words">{value}</p>
                </SpotlightCard>
              ))}
            />
          </Reveal>
        </section>
      </main>
    </>
  );
}
