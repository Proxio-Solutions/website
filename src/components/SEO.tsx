import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://proxiosolutions.com';
const OG_IMAGE = `${BASE_URL}/og-image.png`;

interface SEOProps {
  title: string;
  description: string;
  type?: string;
}

export default function SEO({ title, description, type = 'website' }: SEOProps) {
  const { pathname } = useLocation();
  const pageTitle = `${title} | Proxio Solutions`;
  const canonicalUrl = `${BASE_URL}${pathname}`;

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={OG_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </>
  );
}
