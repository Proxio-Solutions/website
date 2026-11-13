import CtaSection from '@components/motion/CtaSection';
import PageHero from '@components/motion/PageHero';
import SpotlightCard from '@components/motion/SpotlightCard';
import Reveal from '@components/Reveal';
import SEO from '@components/SEO';
import { ARTICLES, formatDate, readingMinutes, type Article } from '@/content/insights';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from '@components/LocalizedLink';

const heroHighlights: Record<string, string[]> = {
  pt: ['aprendemos'],
  en: ['learn'],
};

export function ArticleCard({ article }: { article: Article }) {
  const { t, i18n } = useTranslation();
  const copy = article[i18n.language === 'en' ? 'en' : 'pt'];

  return (
    <SpotlightCard className="group bg-proxio-darker border-proxio-dark-border hover:border-proxio-accent/40 relative flex h-full flex-col rounded-2xl border p-6 transition-colors sm:p-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
        <span className="text-proxio-accent tracking-wider uppercase">{copy.tag}</span>
        <span className="text-proxio-text-muted">
          <time dateTime={article.date}>{formatDate(article.date, i18n.language)}</time>
          {' · '}
          {t('insights.minutes', { count: readingMinutes(copy) })}
        </span>
      </div>
      {/* The link's ::after covers the whole card, so the card is one click target. The heading
          must stay static (.spotlight makes children relative) so the card is the containing block. */}
      <h2 className="text-proxio-text-main !static mt-4 text-xl leading-snug font-bold sm:text-2xl">
        <Link
          viewTransition
          to={`/insights/${article.slug}`}
          className="focus-visible:after:ring-proxio-accent after:absolute after:inset-0 after:z-10 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2"
        >
          {copy.title}
        </Link>
      </h2>
      <p className="text-proxio-text-muted mt-3 leading-relaxed">{copy.excerpt}</p>
      <span className="text-proxio-text-main mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold">
        {t('insights.read')}
        <ArrowRight className="text-proxio-accent h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </SpotlightCard>
  );
}

export default function Insights() {
  const { t, i18n } = useTranslation();
  const articles = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <SEO title={t('insights.seo.title')} description={t('insights.hero.subtitle')} />

      <main>
        <PageHero
          label={t('insights.hero.label')}
          title={t('insights.hero.title')}
          highlights={heroHighlights[i18n.language] ?? heroHighlights.en}
          subtitle={t('insights.hero.subtitle')}
        />

        <section className="bg-proxio-dark border-proxio-dark-border border-y py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => (
                <li key={article.slug}>
                  <Reveal className="h-full" delay={i * 100}>
                    <ArticleCard article={article} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CtaSection
          title={t('insights.cta.title')}
          subtitle={t('insights.cta.subtitle')}
          primary={{ to: '/contact', label: t('insights.cta.button') }}
        />
      </main>
    </>
  );
}
