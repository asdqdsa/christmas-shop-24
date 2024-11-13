import { defineConfig, normalizePath } from "vite";

export default defineConfig({
  base: "/asdqdsa-JSFE2024Q4/",
  build: {
    assetsInclude: ["**/*.woff", "**/*.woff2", "**/*.ttf"],
    sourcemap: true, // Enables source maps for prod build
    minify: false, // Disable minification for prod build
    rollupOptions: {
      input: {
        main: "index.html",
        normalize: "src/styles/modern-normalize.css",
      },
    },
    cssCodeSplit: true, // Enables CSS code splitting
  },
});
