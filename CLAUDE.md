# CLAUDE.md

Guidance for Claude Code (and anyone else) working in this repository.

## Overview

Institutional website of **Proxio Solutions**, live at [proxiosolutions.com](https://proxiosolutions.com).
React 19 + TypeScript + Vite, Tailwind CSS 4, React Router 7, i18next (PT and EN), deployed as a
static site to GitHub Pages from `main`. See `README.md` for setup and environment variables.

## Project rules

The rules live in `.claude/rules/`, one file per topic. They are as binding as this file and are
loaded into every session through the imports below.

| File                            | Covers                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------ |
| `.claude/rules/git-workflow.md` | Branches (`main` ← `dev` ← `<type>/<slug>`), Conventional Commits, PR flow, git hard rules |
| `.claude/rules/content.md`      | Copy, translations, confidentiality, no invented social proof, articles                    |

@.claude/rules/git-workflow.md
@.claude/rules/content.md

### Adding and changing rules

The team defines rules as the project goes. When the user states a new convention or corrects
how something should be done in this repo (not a one-off preference for the current task):

1. Add it to the `.claude/rules/` file for that topic, or create `.claude/rules/<topic>.md` when
   no file fits. Keep each rule short, say why when it is not obvious, and give an example.
2. A new file gets a row in the table above and an `@.claude/rules/<topic>.md` import line.
3. If a rule replaces an older one, edit or delete the old one; never leave two that disagree.
4. Commit it on its own as `docs(rules): <what changed>`, following the git workflow.

Personal preferences that are not about this repo belong in Claude's memory, not here.

## Commands

```bash
npm install                    # dependencies
npm run dev                    # Vite dev server
npm run build                  # type-check, bundle and pre-render every route (what the deploy runs)
npm run preview                # serve the production build
npx tsc -b                     # type-check only
npm run lint                   # ESLint (react-hooks, react-refresh, typescript-eslint)
npx prettier --check .         # formatting (config in .prettierrc); the whole repo is clean
```

## Structure

```
src/
├── pages/        # One component per route; routes are declared in routes.tsx
├── components/   # Shared components (Navbar, Footer, SEO, Reveal, …)
├── config/       # Navigation links (menu and footer) and external links
├── hooks/        # Custom hooks (language from the ?lang= query)
├── i18n/         # i18next setup and locales/pt.json, locales/en.json
├── services/     # Static data for projects and team
├── assets/       # Images bundled by Vite
└── index.css     # Tailwind theme tokens and global styles
public/           # Copied as-is: CNAME, robots.txt, sitemap.xml, icons, og image
.github/workflows # deploy.yml: builds and publishes main to GitHub Pages
```

When a change alters this structure, the commands or the stack, update this file in the same PR.

## Conventions

- **Routing:** add a page in `src/pages/`, its route in `src/routes.tsx` (before the `*` route)
  and its path in `prerenderPages` in `src/entry-server.tsx`, so it is rendered to static HTML.
  Public pages also go in `public/sitemap.xml`, and in `src/config/navigation.ts` if they belong
  in the menu and footer.
- **SEO:** every page renders `<SEO title description />` from `src/components/SEO.tsx`.
- **Copy:** never hard-code user-facing text; see `.claude/rules/content.md`.
- **Environment:** only `VITE_`-prefixed variables reach the client; never put secrets in them.
- **Verify in the browser** (desktop and mobile, PT and EN) before saying a visual change is done.
