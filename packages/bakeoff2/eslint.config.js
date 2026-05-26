import withNuxt from './.nuxt/eslint.config.mjs';

export default await withNuxt({
  rules: {
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'any',
        },
      },
    ],
  },
});
