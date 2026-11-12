/**
 * Build-time pre-rendering: renders every page in `prerenderPages` (src/entry-server.tsx) to static HTML so the
 * first paint does not wait for the JS bundle. Runs after the client and SSR builds:
 *
 *   vite build                       -> dist/ (client, with .vite/manifest.json)
 *   vite build --ssr ... dist-ssr/   -> dist-ssr/entry-server.js
 *   node scripts/prerender.mjs       -> dist/<route>.html, dist/<route>/index.html, dist/404.html
 *
 * Each page is rendered twice: in Portuguese at its path and in English under /en. The same
 * list produces dist/sitemap.xml.
 *
 * The client (src/main.tsx) hydrates this HTML when it matches the URL and language.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const ssrDir = path.join(root, 'dist-ssr');

const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const manifest = JSON.parse(await readFile(path.join(dist, '.vite', 'manifest.json'), 'utf8'));
const { render, prerenderPages } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
);

/**
 * JS chunks (and CSS) a lazy page needs on top of the entry, from the client build manifest,
 * so they download with the HTML instead of being found after the bundle runs.
 */
function pagePreloads(source) {
  if (!source) return [];
  if (!manifest[source]) throw new Error(`No client chunk for ${source} in the Vite manifest`);

  const files = new Set();
  const css = new Set();
  const visit = (key) => {
    const chunk = manifest[key];
    if (!chunk || chunk.isEntry || files.has(chunk.file)) return;
    if (template.includes(`/${chunk.file}"`)) return; // already preloaded by the entry
    files.add(chunk.file);
    chunk.css?.forEach((file) => css.add(file));
    chunk.imports?.forEach(visit);
  };
  visit(source);

  return [
    ...[...css].map((file) => `<link rel="stylesheet" crossorigin href="/${file}">`),
    ...[...files].map(
      (file) => `<link rel="modulepreload" fetchpriority="low" crossorigin href="/${file}">`,
    ),
  ];
}

const HEAD_TAG = /<title>[\s\S]*?<\/title>|<(?:meta|link)\b[^>]*>/g;

/** Key a head tag by what it describes, so the page's tag replaces the template's default. */
function headKey(tag) {
  if (tag.startsWith('<title')) return 'title';
  // Case-insensitive like HTML itself: React writes `hrefLang`
  const attr = (name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1];
  if (tag.startsWith('<link')) {
    if (attr('rel') === 'canonical') return 'canonical';
    if (attr('rel') === 'alternate' && attr('hreflang')) return `alternate:${attr('hreflang')}`;
    return null;
  }
  const key = attr('name') ?? attr('property');
  return key ? `meta:${key}` : null;
}

function buildPage({ path: routePath, lang, source }, appHtml) {
  // React renders the SEO component's <title>/<meta>/<link> inline and hoists them into <head>
  // on the client. Do the same here, replacing the template's site-wide defaults.
  const pageTags = new Map();
  const body = appHtml.replace(HEAD_TAG, (tag) => {
    pageTags.set(headKey(tag), tag);
    return '';
  });

  let html = template.replace(HEAD_TAG, (tag) => {
    const key = headKey(tag.replace(/\s+/g, ' '));
    return key && pageTags.has(key) ? '' : tag;
  });
  const head = [...pageTags.values(), ...pagePreloads(source)];
  html = html.replace('</head>', `  ${head.join('\n    ')}\n  </head>`);
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root" data-prerendered="${routePath}">${body}</div>`,
  );
  // The template is Portuguese; English pages (/en/...) declare their own language
  html = html.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);
  // Collapse the blank lines left behind by removed template tags
  return html.replace(/\n(\s*\n)+/g, '\n');
}

async function write(file, html) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
}

// The 404 page stays the plain client shell: GitHub Pages serves it for any unknown URL,
// so it must not carry another route's markup, nor the home page's canonical URL
await writeFile(
  path.join(dist, '404.html'),
  template
    .replace(HEAD_TAG, (tag) =>
      ['canonical', 'meta:og:url'].includes(headKey(tag.replace(/\s+/g, ' '))) ? '' : tag,
    )
    .replace(/\n(\s*\n)+/g, '\n'),
);

for (const page of prerenderPages) {
  const routePath = page.path;
  const html = buildPage(page, await render(routePath));
  if (routePath === '/') {
    await write(path.join(dist, 'index.html'), html);
  } else {
    // about.html serves /about on GitHub Pages without a redirect; about/index.html serves it
    // on static servers that only resolve directories (Lighthouse CI, vite preview)
    await write(path.join(dist, `${routePath.slice(1)}.html`), html);
    await write(path.join(dist, routePath.slice(1), 'index.html'), html);
  }
  console.log(`prerendered ${routePath}`);
}

// The sitemap lists exactly the pages built above (new articles and feature flags included),
// each with its other-language twin as an hreflang alternate
const SITE = 'https://proxiosolutions.com';
const sitemapEntry = ({ path: routePath, alternates }) =>
  [
    '  <url>',
    `    <loc>${SITE}${routePath}</loc>`,
    ...Object.entries(alternates).map(
      ([lang, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${lang}" href="${SITE}${href}"/>`,
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${alternates.pt}"/>`,
    '  </url>',
  ].join('\n');
await writeFile(
  path.join(dist, 'sitemap.xml'),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...prerenderPages.map(sitemapEntry),
    '</urlset>',
    '',
  ].join('\n'),
);
console.log(`sitemap: ${prerenderPages.length} URLs`);

await rm(ssrDir, { recursive: true, force: true });
await rm(path.join(dist, '.vite'), { recursive: true, force: true });
