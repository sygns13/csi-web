import { defineConfig } from "@playwright/test";
import { baseConfig } from "./playwright.config";

// Mismas pruebas contra la imagen Docker: docker run --rm -p 8080:80 csi-web:latest (§17.1).
export default defineConfig({
  ...baseConfig,
  use: { ...baseConfig.use, baseURL: "http://localhost:8080" },
});
