import i18n from '@/i18n';
import { routes, prerenderPaths } from '@/routes';
import ErrorBoundary from '@components/ErrorBoundary';
import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom';

export { prerenderPaths };

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
