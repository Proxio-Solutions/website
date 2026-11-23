import { languageFromPath, localizePath } from '@/i18n/paths';
import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  useLocation,
  type LinkProps,
  type NavLinkProps,
  type To,
} from 'react-router-dom';

/** Points a site path at the language of the current page: `/contact` becomes `/en/contact` on an English page. */
function useLocalizedTo(to: To): To {
  const language = languageFromPath(useLocation().pathname);
  if (typeof to === 'string') return localizePath(to, language);
  return to.pathname ? { ...to, pathname: localizePath(to.pathname, language) } : to;
}

/**
 * Drop-in replacements for React Router's `Link` and `NavLink`: write site paths in their plain
 * form (`/contact`) and they follow the page's language. Use these for every internal link.
 */
export function Link({ to, ...props }: LinkProps) {
  return <RouterLink to={useLocalizedTo(to)} {...props} />;
}

export function NavLink({ to, ...props }: NavLinkProps) {
  return <RouterNavLink to={useLocalizedTo(to)} {...props} />;
}
