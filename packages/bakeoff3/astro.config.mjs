// @ts-check
import { defineConfig } from 'astro/config';

import clerk from '@clerk/astro';
import solidJs from '@astrojs/solid-js';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  integrations: [clerk(), solidJs()],
  adapter: netlify(),
  output: 'server',
});
