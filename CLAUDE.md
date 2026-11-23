# CLAUDE.md

Guidance for Claude Code (and anyone else) working in this repository.

## Overview

Institutional website of **Proxio Solutions**, live at [proxiosolutions.com](https://proxiosolutions.com).
React 19 + TypeScript + Vite, Tailwind CSS 4, React Router 7, i18next (PT and EN), deployed as a
static site to GitHub Pages from `main`. See `README.md` for setup and environment variables.

## Project rules

The rules live in `.claude/rules/`, one file per topic. They are as binding as this file and are
loaded into every session through the imports below.

| File                            | Covers                                                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `.claude/rules/git-workflow.md` | Branches (`main` ← `staging` ← `dev` ← `<type>/<slug>`), Conventional Commits, PR flow, git hard rules |
| `.claude/rules/content.md`      | Copy, translations, confidentiality, no invented social proof, articles                                |
| `.claude/rules/urls.md`         | URL paths, slugs and anchors always in English; changing live URLs                                     |

@.claude/rules/git-workflow.md
@.claude/rules/content.md
@.claude/rules/urls.md

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
├── config/       # Navigation links (menu and footer), external links and feature flags
├── hooks/        # Custom hooks (language from the ?lang= query)
├── i18n/         # i18next setup and locales/pt.json, locales/en.json
├── services/     # Static data for projects and team
├── assets/       # Images bundled by Vite
└── index.css     # Tailwind theme tokens and global styles
public/           # Copied as-is: CNAME, robots.txt, icons, og image (the build writes sitemap.xml)
.github/workflows # deploy.yml publishes main to GitHub Pages; on PRs, checks.yml (lint, Prettier)
                  # and lighthouse.yml (build + performance budgets in lighthouserc.json)
.claude/          # rules/ (project rules), skills/impeccable and agents/impeccable-* (design skills)
```

## Design skills (Impeccable)

The [Impeccable](https://impeccable.style) design skills are vendored in
`.claude/skills/impeccable/` and `.claude/agents/impeccable-*.md`, as published (Prettier skips
them). In a session, `/impeccable <command>` reviews or refines the UI: `audit`, `critique` and
`polish`, among others. `/impeccable init` writes `PRODUCT.md` and `DESIGN.md`, the product and
design context every command reads.

- **Project rules win.** The skills suggest; `.claude/rules/` decides. Copy still follows
  `content.md` (PT-PT with "tu", no invented social proof, i18n for every string).
- **Update** with `npx impeccable skills update`. It never overwrites `PRODUCT.md` or `DESIGN.md`.
- **No hooks.** The skills were installed with `--no-hooks`, so nothing runs on every edit. Keep
  it that way on reinstall:
  `npx impeccable skills install --project --providers=claude --no-hooks`.
- The skill downloads its engine binary to `~/.impeccable/` on first use, verified against
  `scripts/engine-checksums.txt`.

When a change alters this structure, the commands or the stack, update this file in the same PR.

## Conventions

- **Routing:** add a page in `src/pages/`, its route in `pages()` in `src/routes.tsx` (before the
  `*` route) and its path in `pages` in `src/entry-server.tsx`, so it is rendered to static HTML
  and listed in the sitemap, which the build generates from that list. Add it to
  `src/config/navigation.ts` too if it belongs in the menu and footer.
- **Languages in the URL:** Portuguese at `/about`, English at `/en/about` (`src/i18n/paths.ts`).
  Every route exists in both languages and is pre-rendered in both. Import `Link`/`NavLink` from
  `@components/LocalizedLink` and write the plain path (`/contact`); it adds `/en` on English
  pages.
- **SEO:** every page renders `<SEO title description />` from `src/components/SEO.tsx`.
- **Copy:** never hard-code user-facing text; see `.claude/rules/content.md`.
- **Environment:** only `VITE_`-prefixed variables reach the client; never put secrets in them.
- **Verify in the browser** (desktop and mobile, PT and EN) before saying a visual change is done.
