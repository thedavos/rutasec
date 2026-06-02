import { defineConfig, devices } from "@playwright/test";

const port = 3000;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;

/** CI default when the secret is unset or empty (empty string bypasses `??`). */
const ciAuthSecret = process.env.BETTER_AUTH_SECRET || "ci-only-not-for-production-use-32chars!!";
const ciAuthUrl = process.env.BETTER_AUTH_URL || `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // CI has no .env.local; dev uses dotenv -e .env.local only
    command: process.env.CI ? "npm run dev:e2e" : "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: process.env.CI
      ? {
          ...process.env,
          CLOUDFLARE_INCLUDE_PROCESS_ENV: "true",
          BETTER_AUTH_SECRET: ciAuthSecret,
          BETTER_AUTH_URL: ciAuthUrl,
        }
      : undefined,
  },
});
