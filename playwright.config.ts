import fs from 'fs';
import path from 'path';
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { Config } from './src/config/Config';

const generatedTestsDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: 'tests/steps/**/*.ts',
});

const enableJiraReporter = process.env.ENABLE_JIRA ?? 'false';
process.env.ENABLE_JIRA = enableJiraReporter;

const jiraReporterPath = path.resolve(__dirname, 'dist', 'utils', 'jiraReporter.js');
const reporters: [string, Record<string, unknown>?][] = [
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['json', { outputFile: 'test-results/results.json' }],
  ['list', {}],
  ['allure-playwright', { outputFolder: 'allure-results' }],
];

if (Config.enableExecutionSummary) {
  reporters.push([
    path.resolve(__dirname, 'src', 'utils', 'ExecutionSummaryReporter.ts'),
    {
      jsonOutputFile: Config.executionSummaryJson,
      markdownOutputFile: Config.executionSummaryMarkdown,
    },
  ]);
}

if (enableJiraReporter === 'true' && fs.existsSync(jiraReporterPath)) {
  reporters.push([jiraReporterPath]);
}

export default defineConfig({
  testDir: generatedTestsDir,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: reporters,
  testIgnore: ['tests/**/*.spec.ts'],
  use: {
    baseURL: Config.baseURL,
    trace: 'on-all-retries',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: Config.TIMEOUT.LONG,
    navigationTimeout: Config.TIMEOUT.LONG,
    headless: process.env.HEADLESS !== 'false',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
});
