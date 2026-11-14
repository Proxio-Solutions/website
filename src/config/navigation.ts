import { insightsEnabled } from './features';

export const NAV_LINKS = [
  { translationKey: 'nav.home', href: '/' },
  { translationKey: 'nav.about', href: '/about' },
  { translationKey: 'nav.projects', href: '/projects' },
  { translationKey: 'nav.services', href: '/services' },
  // Hidden until the first article is published
  ...(insightsEnabled ? [{ translationKey: 'nav.insights', href: '/insights' }] : []),
  { translationKey: 'nav.contact', href: '/contact' },
];
