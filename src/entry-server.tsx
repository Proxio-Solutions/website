import { ARTICLES } from '@/content/insights';
import i18n from '@/i18n';
import { LANGUAGES, languageFromPath, localizePath, type Language } from '@/i18n/paths';
import { caseStudyUrbiEnabled, routes } from '@/routes';
import ErrorBoundary from '@components/ErrorBoundary';
import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom';

/**
 * Pages rendered to static HTML at build time (see scripts/prerender.mjs), by their Portuguese
 * path. `source` is the lazy page module, so its chunk can be preloaded; Home is in the entry
 * bundle and needs none. Lives here, not in src/routes.tsx, so the article list stays out of the
 * client bundle.
 */
const pages: { path: string; source?: string; lastmod?: string }[] = [
  { path: '/' },
  { path: '/about', source: 'src/pages/About.tsx' },
  { path: '/projects', source: 'src/pages/Projects.tsx' },
  { path: '/services', source: 'src/pages/Services.tsx' },
  { path: '/contact', source: 'src/pages/Contact.tsx' },
  {
    path: '/insights',
    source: 'src/pages/Insights.tsx',
    // The list changes whenever an article does
    lastmod: ARTICLES.map(({ date, updated }) => updated ?? date)
      .sort()
      .at(-1),
  },
  // New articles are picked up automatically
  ...ARTICLES.map(({ slug, date, updated }) => ({
    path: `/insights/${slug}`,
    source: 'src/pages/InsightArticle.tsx',
    lastmod: updated ?? date,
  })),
  { path: '/privacy-policy', source: 'src/pages/PrivacyPolicy.tsx' },
  ...(caseStudyUrbiEnabled
    ? [{ path: '/case-studies/urbi', source: 'src/pages/CaseStudyUrbi.tsx' }]
    : []),
];

/**
 * Every page once per language: `/about` in Portuguese and `/en/about` in English.
 * `alternates` is the same page in each language, for the sitemap's hreflang links.
 */
export const prerenderPages: {
  path: string;
  lang: Language;
  alternates: Record<Language, string>;
  source?: string;
  /** ISO date of the last content change, only where it is known (articles); for the sitemap. */
  lastmod?: string;
}[] = LANGUAGES.flatMap((lang) =>
  pages.map((page) => ({
    ...page,
    path: localizePath(page.path, lang),
    lang,
    alternates: { pt: localizePath(page.path, 'pt'), en: localizePath(page.path, 'en') },
  })),
);

/** Renders one route to HTML at build time, in the language of its path. */
export async function render(path: string) {
  await i18n.changeLanguage(languageFromPath(path));

  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`https://proxiosolutions.com${path}`));
  if (context instanceof Response) throw new Error(`Unexpected redirect while rendering ${path}`);

  const router = createStaticRouter(handler.dataRoutes, context);
  const app = (
    <StrictMode>
      <ErrorBoundary>
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </ErrorBoundary>
    </StrictMode>
  );
  // prerender (unlike renderToString) waits for React.lazy content such as the Urbi demo. An
  // unbounded chunk size keeps every boundary inline, instead of the <template>/<script> swap
  // React streams for large boundaries.
  const { prelude } = await prerender(app, { progressiveChunkSize: Number.POSITIVE_INFINITY });
  return new Response(prelude).text();
}
