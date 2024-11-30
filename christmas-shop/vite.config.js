import { defineConfig, normalizePath } from 'vite';
import postcss from 'postcss';
import obfuscatorPlugin from './obfuscatorPlugin';

export default defineConfig({
  base: '/asdqdsa-JSFE2024Q4/',
  build: {
    assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf'],
    sourcemap: 'inline', // Enables source maps for prod build
    minify: true, // Disable minification for prod build
    rollupOptions: {
      input: {
        main: 'index.html',
        gifts: 'gifts.html',
        normalize: 'src/styles/modern-normalize.css',
      },
    },
    cssCodeSplit: true, // Enables CSS code splitting
  },

  plugins: [obfuscatorPlugin()],
});
