import App from '@/App.tsx';
import { caseStudyUrbiEnabled, insightsEnabled } from '@/config/features';
import Home from '@pages/Home.tsx';
import type { ComponentType } from 'react';
import type { RouteObject } from 'react-router-dom';

/** Loads a page in its own chunk; the router fetches it before navigating, so there is no blank fallback. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

/**
 * The site's pages, with paths relative to the language root. Built fresh for each language
 * because main.tsx resolves lazy routes in place.
 * Every page here is also rendered to static HTML at build time: list it in
 * src/entry-server.tsx (`pages`). Home ships in the main bundle (it is the landing page); every
 * other page is split out.
 */
const pages = (): RouteObject[] => [
  { index: true, element: <Home /> },
  { path: 'about', lazy: page(() => import('@pages/About.tsx')) },
  { path: 'projects', lazy: page(() => import('@pages/Projects.tsx')) },
  { path: 'services', lazy: page(() => import('@pages/Services.tsx')) },
  { path: 'contact', lazy: page(() => import('@pages/Contact.tsx')) },
  ...(insightsEnabled
    ? [
        { path: 'insights', lazy: page(() => import('@pages/Insights.tsx')) },
        { path: 'insights/:slug', lazy: page(() => import('@pages/InsightArticle.tsx')) },
      ]
    : []),
  { path: 'privacy-policy', lazy: page(() => import('@pages/PrivacyPolicy.tsx')) },
  ...(caseStudyUrbiEnabled
    ? [{ path: 'case-studies/urbi', lazy: page(() => import('@pages/CaseStudyUrbi.tsx')) }]
    : []),
  { path: '*', lazy: page(() => import('@pages/NotFound.tsx')) },
];

// Portuguese at the root, English under /en (see src/i18n/paths.ts). The Portuguese pages sit
// under a pathless route so both languages have the same depth: switching language then
// re-renders the same page with new words instead of mounting it again from scratch.
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [{ children: pages() }, { path: 'en', children: pages() }],
  },
];
