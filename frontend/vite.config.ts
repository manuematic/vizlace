import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/main.ts",
      name: "vizlace",
      fileName: () => "vizlace.js",
      formats: ["es"],
    },
    rollupOptions: {
      external: [],
    },
    outDir: "../custom_components/vizlace/www",
    emptyOutDir: false,
    minify: false,
  },
});
