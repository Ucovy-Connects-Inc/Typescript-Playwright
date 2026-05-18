import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Config } from '../config/Config';

export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#input-email');
    this.passwordInput = page.locator('#input-password');
    this.loginButton = page.locator('input[value="Login"]');
    this.errorMessage = page.locator('.alert-danger');
    this.pageHeading = page.getByRole('heading', { name: 'Returning Customer' });
  }

  async open(): Promise<void> {
    await this.navigate(`${Config.baseURL}/index.php?route=account/login`);
  }

  async login(email: string, password: string): Promise<void> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async isDisplayed(): Promise<boolean> {
    return this.isVisible(this.pageHeading);
  }

  async isErrorMessageDisplayed(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  async getErrorMessage(): Promise<string> {
    return (await this.getText(this.errorMessage)).trim();
  }
}
