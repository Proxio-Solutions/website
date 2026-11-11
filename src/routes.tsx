import App from '@/App.tsx';
import Home from '@pages/Home.tsx';
import type { ComponentType } from 'react';
import type { RouteObject } from 'react-router-dom';

const caseStudyUrbiEnabled = import.meta.env.VITE_ENABLE_CASE_STUDY_URBI === 'true';

/** Loads a page in its own chunk; the router fetches it before navigating, so there is no blank fallback. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

/** Paths that are rendered to static HTML at build time (see scripts/prerender.mjs). */
export const prerenderPaths = [
  '/',
  '/about',
  '/projects',
  '/services',
  '/contact',
  '/privacy-policy',
  ...(caseStudyUrbiEnabled ? ['/case-studies/urbi'] : []),
];

// Home ships in the main bundle (it is the landing page); every other page is split out
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', lazy: page(() => import('@pages/About.tsx')) },
      { path: '/projects', lazy: page(() => import('@pages/Projects.tsx')) },
      { path: '/services', lazy: page(() => import('@pages/Services.tsx')) },
      { path: '/contact', lazy: page(() => import('@pages/Contact.tsx')) },
      { path: '/privacy-policy', lazy: page(() => import('@pages/PrivacyPolicy.tsx')) },
      ...(caseStudyUrbiEnabled
        ? [{ path: '/case-studies/urbi', lazy: page(() => import('@pages/CaseStudyUrbi.tsx')) }]
        : []),
      { path: '*', lazy: page(() => import('@pages/NotFound.tsx')) },
    ],
  },
];
