import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  retries: 0,
  workers: 4,
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    colorScheme: 'light',
  },
  webServer: {
    command: 'pnpm preview',
    port: 4321,
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: devices['Desktop Chrome'] },
    { name: 'mobile', use: devices['iPhone 15'] },
  ],
});
