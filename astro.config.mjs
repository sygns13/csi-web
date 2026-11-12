// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://bcscode.com",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "never" },
  i18n: {
    defaultLocale: "es",
    locales: ["es"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [sitemap({ filter: (page) => !page.includes("/404") })],
  vite: {
    plugins: [tailwindcss()],
    // Todo script procesado sale como archivo en /_astro/ (no inline) → CSP sin 'unsafe-inline'.
    build: { assetsInlineLimit: 0 },
  },
});
