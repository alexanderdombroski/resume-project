// @ts-check
import { defineConfig, envField } from 'astro/config';

import solidJs from '@astrojs/solid-js';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      TURSO_DATABASE_URL: envField.string({ context: 'server', access: 'public' }),
      TURSO_AUTH_TOKEN: envField.string({ context: 'server', access: 'public' }),
      PUBLIC_CLERK_PUBLISHABLE_KEY: envField.string({ context: 'client', access: 'public' }),
    },
  },
  integrations: [solidJs()],
  adapter: netlify(),
  output: 'static',
  devToolbar: {
    enabled: false,
  },
});
