import CtaSection from '@components/motion/CtaSection';
import PageHero from '@components/motion/PageHero';
import Reveal from '@components/Reveal';
import SEO from '@components/SEO';
import { ARTICLES, formatDate, getArticle, readingMinutes, type Block } from '@/content/insights';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from '@components/LocalizedLink';
import { useParams } from 'react-router-dom';
import { ArticleCard } from './Insights';
import NotFound from './NotFound';

function BodyBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="text-proxio-text-main mt-12 mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
          {block.text}
        </h2>
      );
    case 'ul':
      return (
        <ul className="my-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3">
              <span
                className="bg-proxio-accent mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full"
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return <p className="my-5">{block.text}</p>;
  }
}

export default function InsightArticle() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const article = getArticle(slug);

  if (!article) return <NotFound />;

  const lang = i18n.language === 'en' ? 'en' : 'pt';
  const copy = article[lang];
  const others = ARTICLES.filter((other) => other.slug !== article.slug).slice(0, 2);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: copy.title,
    description: copy.excerpt,
    datePublished: article.date,
    inLanguage: lang === 'en' ? 'en' : 'pt-PT',
    author: { '@type': 'Organization', name: 'Proxio Solutions' },
    publisher: { '@type': 'Organization', name: 'Proxio Solutions' },
    mainEntityOfPage: `https://proxiosolutions.com/insights/${article.slug}`,
  };

  return (
    <>
      <SEO title={copy.title} description={copy.excerpt} type="article" />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <main>
        <PageHero
          align="left"
          label={copy.tag}
          title={copy.title}
          subtitle={copy.excerpt}
          before={
            <Link
              viewTransition
              to="/insights"
              className="text-proxio-text-muted hover:text-proxio-text-main mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('insights.back')}
            </Link>
          }
        >
          <p className="text-proxio-text-muted font-mono text-xs">
            <time dateTime={article.date}>{formatDate(article.date, i18n.language)}</time>
            {' · '}
            {t('insights.minutes', { count: readingMinutes(copy) })}
            {' · '}
            Proxio Solutions
          </p>
        </PageHero>

        <article className="bg-proxio-dark border-proxio-dark-border border-y py-16 sm:py-24">
          <div className="text-proxio-text-muted mx-auto max-w-3xl px-4 text-lg leading-relaxed sm:px-6 lg:px-8 [&>*:first-child]:mt-0">
            {copy.body.map((block, i) => (
              <BodyBlock key={i} block={block} />
            ))}
          </div>
        </article>

        {others.length > 0 && (
          <section className="py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-proxio-text-main mb-10 text-2xl font-bold tracking-tight sm:text-3xl">
                {t('insights.more')}
              </h2>
              <ul className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {others.map((other, i) => (
                  <li key={other.slug}>
                    <Reveal className="h-full" delay={i * 100}>
                      <ArticleCard article={other} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <CtaSection
          title={t('insights.cta.title')}
          subtitle={t('insights.cta.subtitle')}
          primary={{ to: '/contact', label: t('insights.cta.button') }}
        />
      </main>
    </>
  );
}
