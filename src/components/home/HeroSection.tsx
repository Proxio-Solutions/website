import Magnetic from '@components/motion/Magnetic';
import PageHero from '@components/motion/PageHero';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const heroHighlights: Record<string, string[]> = {
  pt: ['Soluções Digitais', 'Diferença'],
  en: ['Digital Solutions', 'Difference'],
};

export default function HeroSection() {
  const { t, i18n } = useTranslation();

  return (
    <PageHero
      badge={t('home.hero.badge')}
      title={t('home.hero.title')}
      highlights={heroHighlights[i18n.language] ?? heroHighlights.en}
      subtitle={t('home.hero.subtitle')}
      size="xl"
      fullHeight
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Magnetic className="w-full sm:w-auto">
          <Link
            to="/contact"
            className="bg-proxio-accent hover:bg-proxio-accent-hover shadow-proxio-accent/30 w-full rounded-lg px-8 py-3.5 text-center text-base font-bold text-white shadow-lg transition-colors"
          >
            {t('home.hero.cta')}
          </Link>
        </Magnetic>
        <Link
          to="/projects"
          className="border-proxio-dark-border bg-proxio-darker/70 text-proxio-text-main hover:border-proxio-accent hover:text-proxio-accent group flex w-full items-center justify-center gap-2 rounded-lg border px-8 py-3.5 text-base font-bold backdrop-blur transition-colors sm:w-auto"
        >
          {t('home.hero.learnMore')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </PageHero>
  );
}
