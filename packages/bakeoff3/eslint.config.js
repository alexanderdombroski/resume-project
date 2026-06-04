import { defineConfig } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintPluginSolid from 'eslint-plugin-solid/configs/typescript';
import ts from 'typescript-eslint';
import globals from 'globals';

/**
 * @type {import("eslint").ESLint.Plugin}
 */
const noStaticSolid = {
  meta: {
    name: 'No Static Solid',
  },
  rules: {
    'no-static-solid': {
      meta: {
        type: 'problem',
        schema: [],
        messages: {
          missingDirective: 'Solid component "{{name}}" is missing a client directive',
        },
      },
      create(context) {
        const solidComponents = new Set();
        const validProperties = new Set(['load', 'idle', 'visible', 'only']);

        return {
          ImportDeclaration(node) {
            if (node.source?.value?.endsWith('.tsx')) {
              node.specifiers.forEach((specifier) => {
                solidComponents.add(specifier.local.name);
              });
            }
          },
          JSXOpeningElement(node) {
            if (node.name.type !== 'JSXIdentifier') return;
            const name = node.name.name;
            if (!solidComponents.has(name)) return;
            const hasClientDirective = node.attributes.some((attr) => {
              return (
                !(attr.type !== 'JSXAttribute' || attr.name.type !== 'JSXNamespacedName') &&
                attr.name.namespace?.name === 'client' &&
                validProperties.has(attr.name.name?.name)
              );
            });

            if (!hasClientDirective) {
              context.report({
                node,
                message: `Solid component "${name}" is missing a client directive`,
              });
            }
          },
        };
      },
    },
  },
};

export default defineConfig([
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.astro'],
    plugins: {
      custom: noStaticSolid,
    },
    rules: {
      'astro/no-unused-css-selector': 'warn',
      'custom/no-static-solid': 'warn',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ...eslintPluginSolid,
    languageOptions: {
      parser: ts.parser,
    },
  },
  {
    files: ['**/scripts/**/*.ts', '**/utils/**/*.ts'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    // Rules for all files
    rules: {
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'no-undef': 'warn',
      'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
      eqeqeq: 'warn',
      semi: 'warn',
    },
  },
]);
