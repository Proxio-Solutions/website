# URLs

Rules for every part of a URL a visitor can see or share: route paths, article slugs, `#anchor`
ids and query parameters.

## Always in English

- **Write every URL segment in English**, in both languages. The Portuguese and English versions
  of a page share the same path; only the `/en` prefix differs.
- **Lowercase, kebab-case, ASCII only.** No accents, no spaces, no underscores.

Why: URLs cannot carry accents, so Portuguese words come out misspelled (`comecar`,
`ocorrencias`), and one English path per page is easier to read, type and share.

```
/insights/why-reports-get-lost          ✓   /insights/porque-se-perdem-as-ocorrencias   ✗
/en/insights/why-reports-get-lost       ✓   /en/insights/porque-se-perdem-...           ✗
/services#service-web                   ✓   /servicos#servico-web                       ✗
```

- **Article slugs** (`slug` in `src/content/insights.ts`) follow the English title, shortened to
  its key words.
- **Translating the copy never changes the URL.** Only the visible text lives in `pt`/`en`.

## Changing a live URL

Once a URL is in production (on `main`), renaming it breaks shared links and search results.
Avoid it; if it must change, keep the old path working (a redirect) in the same PR.
