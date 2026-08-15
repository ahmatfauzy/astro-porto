import { mediaModule, pages, projectsModule, vibeModule } from '@navfolio/pages';
import { markdownPlugin } from '@navfolio/plugin-markdown';

import { defineNavfolioConfig } from './src/plugins/config';

const vibe = vibeModule();

vibe.routes = [
  {
    entrypoint: new URL('./src/modules/routes/vibe.astro', import.meta.url),
    prerender: true,
  },
];

export default defineNavfolioConfig({
  modules: [projectsModule(), vibe, mediaModule({ enabled: false })],
  plugins: [
    markdownPlugin({
      expressiveCode: true,
      layouts: true,
      math: {
        enabled: true,
      },
      mermaid: true,
      responsiveTables: true,
    }),
    pages(),
  ],
});