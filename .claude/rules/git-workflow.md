# Git workflow

The canonical branching and commit model for this repo. Claude and humans MUST follow it.
It mirrors `urbi-client`, minus the `staging` branch: this site has no test server, so `dev` is
tested locally instead.

## Branch model

| Branch                          | Role                             | How commits arrive                |
| ------------------------------- | -------------------------------- | --------------------------------- |
| `main`                          | Production. Every push deploys   | PR from `dev` only                |
| `dev`                           | Integration: what we are testing | PR from a work branch             |
| `feat/*`, `fix/*`, `chore/*`, … | One piece of work                | Direct commits during development |

- **`main` is what is live** on proxiosolutions.com: `.github/workflows/deploy.yml` publishes it to
  GitHub Pages on every push. Nothing reaches `main` that was not tested on `dev` first.
- **`dev` is where finished work is put together and tried locally**
  (`git switch dev && git pull && npm run dev`). Writing code does not mean shipping it: work can
  stay on `dev` for as long as it needs to be tested, and only a `dev` → `main` PR releases it.
- **Work branches** start from the latest `dev` and go back to `dev` through a PR.

When the user asks to "merge" a piece of work, it means **into `dev`**, never into `main`. A
release (`dev` → `main`) happens only when the user asks for it in those terms.

## Branch names

`<type>/<short-slug>`: the type is one of the commit types below, the slug is 2–5 words,
kebab-case, lowercase, English.

```
feat/insights-section
fix/brief-skip-reset
perf/webp-photos
build/upgrade-vite
docs/git-workflow
```

Branches created by Claude Code worktrees (`claude/<random-name>`) are local only: rename them
before pushing (`git branch -m feat/<slug>`). The `pre-push` hook rejects any other name.

## Commit messages: Conventional Commits

```
<type>(<scope>): <summary>

<optional body: why the change was needed; the diff already shows what>
```

- **Summary:** imperative, lowercase, no trailing period, at most 72 characters, English.
- **Scope:** optional, encouraged. Use the area of the site: `home`, `about`, `services`,
  `projects`, `contact`, `insights`, `case-study`, `nav`, `footer`, `seo`, `i18n`, `motion`,
  `deps`, `lighthouse`.
- **Breaking change:** `!` after the type or scope (`feat(i18n)!: …`) plus a `BREAKING CHANGE:` line
  in the body. Rare on a website, but the format allows it.

| Type       | Use for                                                |
| ---------- | ------------------------------------------------------ |
| `feat`     | Something a visitor can see or use that was not there  |
| `fix`      | A bug a visitor could hit                              |
| `perf`     | Faster loading or rendering, same behaviour            |
| `refactor` | Code restructured, no visible change                   |
| `style`    | Formatting only (Prettier, whitespace), no code change |
| `docs`     | README, `CLAUDE.md`, `.claude/rules/*`, comments only  |
| `test`     | Tests only                                             |
| `build`    | Vite, TypeScript, npm scripts, dependencies            |
| `ci`       | GitHub Actions workflows, Lighthouse CI                |
| `chore`    | Anything else that does not touch the shipped site     |
| `revert`   | Reverting an earlier commit                            |

Examples:

```
feat(insights): add an articles section with three posts
fix(contact): clear the brief when choosing to just write a message
perf(home): serve the Urbi photos as WebP
build(deps): bump vite to 8.1
ci(lighthouse): run the budget on PRs to dev
```

Commits and PRs carry **no attribution to Claude**: no `Co-Authored-By` trailer, no "Generated
with Claude Code" line.

## Flow

1. **Start**: `git switch dev && git pull && git switch -c feat/<slug>`.
2. **Work**: small commits, each one a single Conventional Commit. Before a commit that matters,
   run the checks below.
3. **PR → `dev`** when the work is complete and verified in the browser. Use the PR template
   (`.github/pull_request_template.md`); the PR title follows the commit format too.
4. **Test on `dev`** locally, together with whatever else is there.
5. **Release**: PR `dev` → `main`, titled `release: <what goes live>`. Merging it deploys.

Stacked work (a branch that needs another one that is not merged yet) branches off that branch
and targets it in its PR; GitHub retargets it to `dev` once the first one merges.

PRs are merged with a **merge commit** (not squash), so the individual Conventional Commits stay
in the history.

## Checks before committing

```bash
npx tsc -b                              # types
npm run lint                            # ESLint
npm run build                           # what CI and the deploy run
npx prettier --check .                  # formatting
```

All four pass on `dev`; a failure after your change is yours to fix.

## Enforcement

Git hooks in `.githooks/` are switched on by `npm install` (the `prepare` script sets
`core.hooksPath`). In a clone that has not run `npm install` since they were added, run
`git config core.hooksPath .githooks` once.

| Hook         | Rejects                                                               |
| ------------ | --------------------------------------------------------------------- |
| `commit-msg` | Messages that are not Conventional Commits, or summaries over 72      |
| `pre-commit` | Commits made directly on `main` or `dev` (concluding a merge is fine) |
| `pre-push`   | Pushes to `main` or `dev`, and branch names outside `<type>/<slug>`   |

Messages git writes itself (`Merge …`, `Revert "…"`, `fixup!`, `squash!`) are accepted. Branches
without `.githooks/` (older than this file) run no hooks.

GitHub does not enforce any of this (no branch protection), so the hooks and these rules are the
only guard. Merge a PR only once its checks are green.

## Hard rules for Claude

1. Never commit directly on `main` or `dev`. Create a work branch first.
2. Never push to `main` or `dev`. They change only through PRs merged on GitHub.
3. Never `git push --force` to `main` or `dev`, even when asked. On a work branch, only if the
   user asks for it explicitly.
4. Never skip hooks (`--no-verify`) unless the user asks for that flag.
5. Never commit or push unless the user asks. "Commit e push" covers that one commit and push.
6. Never merge into `main` unless the user asks for a release in those words.
7. Stage explicit paths. Never `git add -A` / `git add .` (it would pick up `.env*` files and
   local `.claude/` files).
8. Prefer a new commit over `--amend` once something has been pushed.
9. If the current branch does not follow these rules (an old branch, a `claude/*` worktree), say
   so in the first reply and propose the fix before committing.
