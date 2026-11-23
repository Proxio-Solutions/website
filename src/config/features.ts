/** Set by vite.config.ts: true once src/content/insights.ts has at least one article. */
declare const __INSIGHTS_ENABLED__: boolean;

export const insightsEnabled = __INSIGHTS_ENABLED__;

/**
 * The full Urbi presentation: the Home section with its screens and playable demo, and the
 * project card with its logo and link. Off in production while Urbi has no clients to show
 * (VITE_SHOW_URBI in .env and .env.production); Projects then shows a short card instead.
 */
export const urbiShowcaseEnabled = import.meta.env.VITE_SHOW_URBI === 'true';

/** The Urbi case study page (route, sitemap entry and links). Needs the full presentation. */
export const caseStudyUrbiEnabled =
  urbiShowcaseEnabled && import.meta.env.VITE_ENABLE_CASE_STUDY_URBI === 'true';
