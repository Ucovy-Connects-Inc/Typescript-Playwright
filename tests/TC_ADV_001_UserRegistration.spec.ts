import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { RegistrationPage } from '../src/pages/RegistrationPage';
import { AccountPage } from '../src/pages/AccountPage';
import { TestData } from '../src/utils/TestData';
import { Logger } from '../src/utils/Logger';

test.describe('TC_ADV_001: Advanced User Registration & Account Management', () => {
  let homePage: HomePage;
  let registrationPage: RegistrationPage;
  let accountPage: AccountPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    registrationPage = new RegistrationPage(page);
    accountPage = new AccountPage(page); 
  });

  test('Step 1: Navigate to', async ({ page }, testInfo) => {
    testInfo.annotations.push({ type: 'team', description: 'Avinash' });
    Logger.info('Starting Test: Navigate to Registration Page');
    Logger.info('Opening home page');
    await page.goto("https://www.saucedemo.com/")
    await page.waitForTimeout(2000);
    expect(true).toBeFalsy();
    Logger.info('Clicking register link');
    await homePage.clickRegisterLink();
    Logger.info('Checking if registration form is displayed');

    const isFormDisplayed = await registrationPage.isFormDisplayed();
      // Intentionally fail the test
      expect(isFormDisplayed).toBeFalsy(); // <-- This will fail if the form is displayed
      Logger.info('Registration form is displayed successfully');
  });
   test('Step 2: Navigate to @fail', async ({ page }, testInfo) => {
    testInfo.annotations.push({ type: 'team', description: 'Avinash' });
    Logger.info(`Jira Reporter Enabled: ${process.env.ENABLE_JIRA}`);
    Logger.info('Starting Test: Navigate to Registration Page');
    Logger.info('Opening home page');
    await homePage.open();
    await page.waitForTimeout(2000);
    expect(true).toBeFalsy();
    Logger.info('Clicking register link');
    await homePage.clickRegisterLink();
    Logger.info('Checking if registration form is displayed');

    const isFormDisplayed = await registrationPage.isFormDisplayed();
      // Intentionally fail the test
      expect(isFormDisplayed).toBeFalsy(); // <-- This will fail if the form is displayed
      Logger.info('Registration form is displayed successfully');
  });
});