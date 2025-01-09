import { defineConfig } from 'eslint-define-config';
import jsdoc from 'eslint-plugin-jsdoc';
import html from 'eslint-plugin-html';
import promise from 'eslint-plugin-promise';
import importPlugin from 'eslint-plugin-import';
import unicorn from 'eslint-plugin-unicorn';
import noUnsanitized from 'eslint-plugin-no-unsanitized';
import prettier from 'eslint-plugin-prettier';

export default defineConfig([
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        browser: true,
        es2021: true,
      },
    },
    ignores: [
      'dist/**/*', // Ignore all files in the `dist` dir
    ],
    plugins: {
      jsdoc,
      html,
      promise,
      import: importPlugin,
      unicorn,
      'no-unsanitized': noUnsanitized,
      prettier,
    },
    rules: {
      'max-len': ['warn', { code: 80 }], // Set max line length
      'jsdoc/require-jsdoc': [
        'warn',
        { require: { FunctionDeclaration: true } },
      ],
      'prettier/prettier': ['warn', { singleQuote: true, semi: true }],
      eqeqeq: 'warn',
      'no-console': 'off',
      'no-alert': 'warn',
      'import/order': ['warn', { groups: ['builtin', 'external', 'internal'] }],
      'import/newline-after-import': 'warn',

      // Promise plugin
      'promise/always-return': 'warn', // Every function which returns a promise always returns a value not undefined

      // Unicorn plugin
      'unicorn/prefer-query-selector': 'error', // Use of querySelector and querySelectorAll
      'unicorn/no-null': 'warn', // Discourages the use of null for variables, use undefined

      // No-unsanitized plugin
      'no-unsanitized/method': 'error', //  Ensures that any untrusted user input is sanitized before being passed to potentially dangerous methods, such as innerHTML, eval,
      'no-unsanitized/propperty': 'error', // For property assignments. Ensures that potentially dangerous user input isn't assigned directly to DOM properties that could allow for code execution (e.g., setting innerHTML directly with unsanitized input).
    },
  },
  {
    files: ['.eslintrc.{js,cjs}'],
    languageOptions: {
      env: {
        node: true,
      },
      parserOptions: {
        sourceType: 'script',
      },
    },
  },
]);
