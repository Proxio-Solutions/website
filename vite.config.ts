import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * Pages arrive pre-rendered, so the JS only hydrates what is already on screen. Fetching it at
 * low priority lets CSS, fonts and images go first, which brings the first paint forward.
 */
function lowPriorityScripts(): Plugin {
  return {
    name: 'low-priority-scripts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: (html) =>
        html
          .replace(/<script type="module"/g, '<script type="module" fetchpriority="low"')
          .replace(/<link rel="modulepreload"/g, '<link rel="modulepreload" fetchpriority="low"'),
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths(), lowPriorityScripts()],
  base: '/',
  // The manifest lets scripts/prerender.mjs preload each page's lazy chunk (deleted after use)
  build: { manifest: true },
});
