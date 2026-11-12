import { defineConfig, devices } from "@playwright/test";

// Pruebas contra `astro preview` (§17.1). Sin `process`: no se requiere @types/node aquí.
export const baseConfig = defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:4322",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
});

export default defineConfig({
  ...baseConfig,
  webServer: {
    command: "npm run build && npm run preview -- --port 4322",
    url: "http://localhost:4322/",
    // Reutiliza un servidor ya levantado (en CI no lo hay, así que siempre se construye).
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
