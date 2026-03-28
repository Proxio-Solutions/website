import '@/i18n';
import '@/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from '@/App.tsx';
import ErrorBoundary from '@components/ErrorBoundary';
import About from '@pages/About.tsx';
import Contact from '@pages/Contact.tsx';
import Home from '@pages/Home.tsx';
import NotFound from '@pages/NotFound.tsx';
import CaseStudyUrbi from '@pages/CaseStudyUrbi.tsx';
import PrivacyPolicy from '@pages/PrivacyPolicy.tsx';
import Services from '@pages/Services.tsx';
import Projects from './pages/Projects';

const caseStudyUrbiEnabled = import.meta.env.VITE_ENABLE_CASE_STUDY_URBI === 'true';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/projects', element: <Projects /> },
      { path: '/services', element: <Services /> },
      { path: '/contact', element: <Contact /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      ...(caseStudyUrbiEnabled ? [{ path: '/case-studies/urbi', element: <CaseStudyUrbi /> }] : []),
      { path: '*', element: <NotFound /> },
    ],
  },
]);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found. Check that index.html has <div id="root">.');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);
