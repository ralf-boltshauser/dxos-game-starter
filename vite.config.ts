import { ConfigPlugin } from "@dxos/config/vite-plugin";
import { ThemePlugin } from "@dxos/react-ui-theme/plugin";
import react from "@vitejs/plugin-react";
import path, { resolve } from "path";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config
export default defineConfig({
  server: {
    host: true,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./index.html"),
        shell: resolve(__dirname, "./shell.html"),
      },
    },
  },
  worker: {
    format: "es",
    plugins: () => [topLevelAwait(), wasm()],
  },
  plugins: [
    ConfigPlugin(),
    topLevelAwait(),
    wasm(),
    react({ jsxRuntime: "classic" }),
    ThemePlugin({
      content: [
        resolve(__dirname, "./index.html"),
        resolve(__dirname, "./src/**/*.{js,ts,jsx,tsx}"),
        resolve(__dirname, "node_modules/@dxos/react-ui/dist/**/*.mjs"),
        resolve(__dirname, "node_modules/@dxos/react-ui-theme/dist/**/*.mjs"),
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
