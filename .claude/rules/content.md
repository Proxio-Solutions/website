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

- **The team writes the articles.** Claude may help edit, shorten or translate an article the
  team wrote, but never adds one it generated, not even as a draft or placeholder. Why: the
  articles speak for Proxio, and a made-up one is the same as invented social proof.
- **Proxio is broader than Urbi.** Section copy (titles, subtitles, descriptions) talks about
  software and product in general; Urbi and local government are one project, not the focus.
- One entry in `src/content/insights.ts` per article, with `pt` and `en` copy. The list page,
  the article page, the reading time and the sitemap entries (both languages) derive from it.
- While the list is empty the section is hidden (no menu link, route or sitemap entry); adding
  the first article brings it back on the next build.
- The `slug` is English in both languages, from the English title (see `.claude/rules/urls.md`).
