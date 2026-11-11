import '@/i18n';
import '@/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from '@/App.tsx';
import ErrorBoundary from '@components/ErrorBoundary';
import Home from '@pages/Home.tsx';
import type { ComponentType } from 'react';

const caseStudyUrbiEnabled = import.meta.env.VITE_ENABLE_CASE_STUDY_URBI === 'true';

/** Loads a page in its own chunk; the router fetches it before navigating, so there is no blank fallback. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

// Home ships in the main bundle (it is the landing page); every other page is split out
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', lazy: page(() => import('@pages/About.tsx')) },
      { path: '/projects', lazy: page(() => import('@pages/Projects.tsx')) },
      { path: '/services', lazy: page(() => import('@pages/Services.tsx')) },
      { path: '/contact', lazy: page(() => import('@pages/Contact.tsx')) },
      { path: '/insights', lazy: page(() => import('@pages/Insights.tsx')) },
      { path: '/insights/:slug', lazy: page(() => import('@pages/InsightArticle.tsx')) },
      { path: '/privacy-policy', lazy: page(() => import('@pages/PrivacyPolicy.tsx')) },
      ...(caseStudyUrbiEnabled
        ? [{ path: '/case-studies/urbi', lazy: page(() => import('@pages/CaseStudyUrbi.tsx')) }]
        : []),
      { path: '*', lazy: page(() => import('@pages/NotFound.tsx')) },
    ],
  },
]);

const rootElement = document.getElementById('root');
if (!rootElement)
  throw new Error('Root element not found. Check that index.html has <div id="root">.');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);
