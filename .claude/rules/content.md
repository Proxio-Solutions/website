# Content and copy

Rules for anything a visitor reads on the site. They apply to new and changed copy alike.

## Truthfulness

- **Never invent social proof.** No testimonials, client logos, reviews, ratings, case results or
  metrics that are not real and approved by the team. If a section needs them and they do not
  exist yet, leave the section out and say so.
- **Numbers shown as facts must come from the team.** Estimates and ranges (for example the
  contact brief's weeks and budget bands) are placeholders until the team confirms them; flag
  them as such when you add or change them.
- **Present Proxio as a studio.** Do not mention team size.

## Confidentiality

- **Never name the Urbi pilot parish council** anywhere: on the site, in code, comments, commit
  messages or PRs. Refer to it as "a primeira junta de freguesia parceira" / "our first partner
  parish council".
- Do not publish internal documents, roadmap dates or requirement counts unless the team has
  already made them public.

## Voice

- **Portuguese (PT-PT), informal "tu"**, warm and close but professional: the name Proxio comes
  from proximity. Avoid Brazilian Portuguese forms and corporate stiffness.
- **English** mirrors the Portuguese meaning, not a word-for-word translation.

## Translations

- Every user-facing string goes through i18next (`src/i18n/locales/pt.json` and `en.json`).
  Add a key to **both** files in the same change; Portuguese is the fallback language.
- Long-form content that is not UI (the Insights articles in `src/content/insights.ts`) keeps both
  languages side by side in its own file instead of the locale JSON.

## Articles (Insights)

- One entry in `src/content/insights.ts` per article, with `pt` and `en` copy. The list page,
  the article page and the reading time derive from it.
- Add the article to `public/sitemap.xml` in both languages (`/insights/<slug>` and
  `/en/insights/<slug>`, linked with hreflang like the other pages).
- Articles are drafts until the team has read them; say so when you add one.
