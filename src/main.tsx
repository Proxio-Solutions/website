import i18n from '@/i18n';
import { isLanguage, languageFromPath, localizePath, stripLanguage } from '@/i18n/paths';
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

/**
 * Links from before the /en URLs carried the language as `?lang=en`. Move them to the path form
 * (`/about?lang=en` -> `/en/about`) so they keep working and the address bar shows the real URL.
 */
function redirectLegacyLanguageQuery() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('lang');
  if (requested === null) return;
  params.delete('lang');

  const language = isLanguage(requested) ? requested : languageFromPath(window.location.pathname);
  const pathname = localizePath(stripLanguage(normalize(window.location.pathname)), language);
  const rest = params.toString();
  const query = rest ? `?${rest}` : '';
  window.history.replaceState(
    window.history.state,
    '',
    `${pathname}${query}${window.location.hash}`,
  );
}

async function start(root: HTMLElement) {
  redirectLegacyLanguageQuery();
  await i18n.changeLanguage(languageFromPath(window.location.pathname));

  // The build pre-renders every page in both languages, and the language is part of the path.
  // Hydrate only when this HTML belongs to the current URL; otherwise (the 404 shell, a legacy
  // ?lang= link moved to another path) render from scratch.
  const prerenderedPath = root.dataset.prerendered;
  const canHydrate =
    prerenderedPath !== undefined && prerenderedPath === normalize(window.location.pathname);

  // Either way, load the page's chunk first so the router starts with it in hand
  await resolveLazyRoutes();

  if (!canHydrate) {
    root.removeAttribute('data-prerendered');
    createRoot(root).render(app());
    return;
  }

  startHydration();
  hydrateRoot(root, app());
}

void start(rootElement);
