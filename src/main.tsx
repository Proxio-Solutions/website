import i18n from '@/i18n';
import '@/index.css';
import { startHydration } from '@/lib/hydration';
import { routes } from '@/routes';
import ErrorBoundary from '@components/ErrorBoundary';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, matchRoutes, RouterProvider } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (!rootElement)
  throw new Error('Root element not found. Check that index.html has <div id="root">.');

const app = () => (
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={createBrowserRouter(routes)} />
    </ErrorBoundary>
  </StrictMode>
);

/** Strips the trailing slash so `/about/` (served from about/index.html) matches `/about`. */
const normalize = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

/** Loads the lazy chunks of the current URL, so the first render matches the static HTML exactly. */
async function resolveLazyRoutes() {
  const matches = matchRoutes(routes, window.location) ?? [];
  await Promise.all(
    matches.map(async ({ route }) => {
      if (typeof route.lazy !== 'function') return;
      Object.assign(route, await route.lazy(), { lazy: undefined });
    }),
  );
}

async function start(root: HTMLElement) {
  // The build pre-renders each route in Portuguese. Hydrate only when this HTML belongs to the
  // current URL and language; otherwise (404 shell, ?lang=en, stored English) render from scratch.
  const prerenderedPath = root.dataset.prerendered;
  const canHydrate =
    prerenderedPath !== undefined &&
    prerenderedPath === normalize(window.location.pathname) &&
    i18n.resolvedLanguage === 'pt';

  if (!canHydrate) {
    root.removeAttribute('data-prerendered');
    createRoot(root).render(app());
    return;
  }

  await resolveLazyRoutes();
  startHydration();
  hydrateRoot(root, app());
}

void start(rootElement);
