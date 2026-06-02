import { defineConfig } from 'eslint/config';
import svelteLint from './packages/bakeoff1/eslint.config.js';
import nuxtLint from './packages/bakeoff2/eslint.config.js';
import astroLint from './packages/bakeoff3/eslint.config.js';

export default defineConfig([...nuxtLint, ...svelteLint, ...astroLint]);
