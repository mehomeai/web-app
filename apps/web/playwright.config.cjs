const { defineConfig } = require('@playwright/test');

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

module.exports = defineConfig({
  testDir: './tests/accessibility',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4174',
    trace: 'retain-on-failure',
    viewport: { width: 1280, height: 900 },
    launchOptions: { executablePath, args: ['--no-sandbox'] },
  },
  webServer: {
    command: 'pnpm --filter @workspace/web exec vite --config vite.config.ts --mode test --host 127.0.0.1 --port 4174',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
    timeout: 120_000,
    env: { PORT: '4174', BASE_PATH: '/' },
  },
});
