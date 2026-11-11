import { ARTICLES } from '@/content/insights';
import i18n from '@/i18n';
import { caseStudyUrbiEnabled, routes } from '@/routes';
import ErrorBoundary from '@components/ErrorBoundary';
import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom';

/**
 * Pages rendered to static HTML at build time (see scripts/prerender.mjs). `source` is the lazy
 * page module, so its chunk can be preloaded; Home is in the entry bundle and needs none.
 * Lives here, not in src/routes.tsx, so the article list stays out of the client bundle.
 */
export const prerenderPages: { path: string; source?: string }[] = [
  { path: '/' },
  { path: '/about', source: 'src/pages/About.tsx' },
  { path: '/projects', source: 'src/pages/Projects.tsx' },
  { path: '/services', source: 'src/pages/Services.tsx' },
  { path: '/contact', source: 'src/pages/Contact.tsx' },
  { path: '/insights', source: 'src/pages/Insights.tsx' },
  // New articles are picked up automatically
  ...ARTICLES.map(({ slug }) => ({
    path: `/insights/${slug}`,
    source: 'src/pages/InsightArticle.tsx',
  })),
  { path: '/privacy-policy', source: 'src/pages/PrivacyPolicy.tsx' },
  ...(caseStudyUrbiEnabled
    ? [{ path: '/case-studies/urbi', source: 'src/pages/CaseStudyUrbi.tsx' }]
    : []),
];

/** Renders one route to HTML at build time, always in Portuguese (the default language). */
export async function render(path: string) {
  await i18n.changeLanguage('pt');

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
