import { defineConfig } from 'vite';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import path from 'path';

export default defineConfig({
  base: '/asdqdsa-JSFE2024Q4/simon-says/',
  build: {
    assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf'],
    sourcemap: false, // Enables source maps for prod build
    minify: false, // Disable minification for prod build
    rollupOptions: {
      input: {
        main: 'index.html',
        normalize: 'src/styles/modern-normalize.css',
        app: path.resolve(__dirname, 'src/scripts/app.js'),
        view: path.resolve(__dirname, 'src/scripts/view.js'),
        store: path.resolve(__dirname, 'src/scripts/store.js'),
      },
      output: {
        entryFileNames: 'assets/[name].js', // Preserve file names
      },
    },
    cssCodeSplit: true, // Enables CSS code splitting
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({}), // Enables autoprefixer
      ],
    },
  },
});
