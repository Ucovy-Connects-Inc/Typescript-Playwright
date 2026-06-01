import { Locator, Page } from '@playwright/test';
import { BasePage, type LocatorOption } from './BasePage';
import { Config } from '../config/Config';

export class LoginPage extends BasePage {
  private readonly errorMessage: Locator;
  private readonly pageHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.errorMessage = page.locator('.alert-danger');
    this.pageHeading = page.getByRole('heading', { name: 'Returning Customer' });
  }

  async open(): Promise<void> {
    await this.navigate(`${Config.baseURL}/index.php?route=account/login`);
  }

  async login(email: string, password: string): Promise<void> {
    await this.fillAny(this.emailInputOptions(), email, 'fill login email');
    await this.fillAny(this.passwordInputOptions(), password, 'fill login password');
    await this.clickAny(this.loginButtonOptions(), 'submit login form');
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

  private emailInputOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByLabel(/e-mail address/i),
        description: 'email input by label',
      },
      {
        locator: this.page.locator('#input-email'),
        description: 'legacy email input id',
      },
      {
        locator: this.page.locator('input[name="email"]'),
        description: 'email input by name',
      },
    ];
  }

  private passwordInputOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByLabel(/^password$/i),
        description: 'password input by label',
      },
      {
        locator: this.page.locator('#input-password'),
        description: 'legacy password input id',
      },
      {
        locator: this.page.locator('input[name="password"]'),
        description: 'password input by name',
      },
    ];
  }

  private loginButtonOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByRole('button', { name: /login/i }),
        description: 'login button by role',
      },
      {
        locator: this.page.locator('input[value="Login"]'),
        description: 'legacy login submit input',
      },
    ];
  }
}
