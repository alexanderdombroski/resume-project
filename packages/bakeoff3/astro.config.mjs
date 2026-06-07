// @ts-check
import { defineConfig, envField } from 'astro/config';

import clerk from '@clerk/astro';
import solidJs from '@astrojs/solid-js';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      TURSO_DATABASE_URL: envField.string({ context: 'server', access: 'secret' }),
      TURSO_AUTH_TOKEN: envField.string({ context: 'server', access: 'secret' }),
    },
  },
  integrations: [clerk(), solidJs()],
  adapter: netlify(),
  output: 'server',
});
