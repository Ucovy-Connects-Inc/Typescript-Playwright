import { defineConfig, devices } from '@playwright/test';
const enableJiraReporter = process.env.ENABLE_JIRA || 'true';
process.env.ENABLE_JIRA = enableJiraReporter;
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list',{}],
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['./dist/utils/jiraReporter.js']
  ],
  use: {
    baseURL: 'https://www.delta.com/',
    trace: 'on-all-retries',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 30000,
    headless: true,  
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: true,  
      },
    },
    // ... rest of the config
  ],
});