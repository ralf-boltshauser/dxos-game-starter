import { ConfigPlugin } from "@dxos/config/vite-plugin";
import react from "@vitejs/plugin-react";
import path, { resolve } from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
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
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        theme_color: "#000000",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
      workbox: {
        // allow links to open in my pwa matchin "dxos-qwixx.ralf-boltshauser.com"
        navigateFallback: "/index.html",
        navigateFallbackAllowlist: [/^\/[^\_]+\/?/],
      },
    }),
    react({ jsxRuntime: "classic" }),
    // ThemePlugin({
    //   content: [
    //     resolve(__dirname, "./index.html"),
    //     resolve(__dirname, "./src/**/*.{js,ts,jsx,tsx}"),
    //     resolve(__dirname, "node_modules/@dxos/react-ui/dist/**/*.mjs"),
    //     resolve(__dirname, "node_modules/@dxos/react-ui-theme/dist/**/*.mjs"),
    //   ],
    // }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
