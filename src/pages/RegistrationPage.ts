
import { Locator, Page } from '@playwright/test';
import { Config } from '../config/Config';
import { BasePage, type LocatorOption } from './BasePage';

type RegistrationData = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
  confirmPassword: string;
};

export class RegistrationPage extends BasePage {
  private readonly pageHeading: Locator;
  private readonly successHeading: Locator;
  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Register Account' });
    this.successHeading = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
  }

  async open(): Promise<void> {
    await this.navigate(`${Config.baseURL}/index.php?route=account/register`);
  }

  async isFormDisplayed(): Promise<boolean> {
    return this.isVisible(this.pageHeading);
  }

  async fillRegistrationForm(data: RegistrationData): Promise<void> {
    await this.fillAny(this.firstNameInputOptions(), data.firstName, 'fill first name');
    await this.fillAny(this.lastNameInputOptions(), data.lastName, 'fill last name');
    await this.fillAny(this.emailInputOptions(), data.email, 'fill registration email');
    await this.fillAny(this.telephoneInputOptions(), data.telephone, 'fill telephone');
    await this.fillAny(this.passwordInputOptions(), data.password, 'fill registration password');
    await this.fillAny(this.confirmPasswordInputOptions(), data.confirmPassword, 'fill confirm password');
  }

  async agreeToPrivacyPolicy(): Promise<void> {
    await this.clickAny(this.privacyPolicyOptions(), 'agree to privacy policy');
  }

  async clickContinue(): Promise<void> {
    await this.clickAny(this.continueButtonOptions(), 'submit registration form');
  }

  async register(data: RegistrationData): Promise<void> {
    await this.fillRegistrationForm(data);
    await this.agreeToPrivacyPolicy();
    await this.clickContinue();
  }

  async getErrorMessages(): Promise<string[]> {
    return this.page.$$eval('.text-danger', (nodes) => nodes.map((node) => node.textContent?.trim() || ''));
  }

  async isSuccessMessageDisplayed(): Promise<boolean> {
    return this.isVisible(this.successHeading);
  }

  private firstNameInputOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByLabel(/first name/i),
        description: 'first name input by label',
      },
      {
        locator: this.page.locator('input[name="firstname"]'),
        description: 'first name input by name',
      },
    ];
  }

  private lastNameInputOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByLabel(/last name/i),
        description: 'last name input by label',
      },
      {
        locator: this.page.locator('input[name="lastname"]'),
        description: 'last name input by name',
      },
    ];
  }

  private emailInputOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByLabel(/e-mail/i),
        description: 'registration email by label',
      },
      {
        locator: this.page.locator('input[name="email"]'),
        description: 'registration email by name',
      },
    ];
  }

  private telephoneInputOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByLabel(/telephone/i),
        description: 'telephone input by label',
      },
      {
        locator: this.page.locator('input[name="telephone"]'),
        description: 'telephone input by name',
      },
    ];
  }

  private passwordInputOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByLabel(/^password$/i),
        description: 'registration password by label',
      },
      {
        locator: this.page.locator('input[name="password"]'),
        description: 'registration password by name',
      },
    ];
  }

  private confirmPasswordInputOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByLabel(/password confirm/i),
        description: 'confirm password by label',
      },
      {
        locator: this.page.locator('input[name="confirm"]'),
        description: 'confirm password by name',
      },
    ];
  }

  private privacyPolicyOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.locator('label[for="input-agree"]'),
        description: 'privacy policy label',
      },
      {
        locator: this.page.locator('#input-agree'),
        description: 'privacy policy checkbox by id',
      },
      {
        locator: this.page.getByRole('checkbox', { name: /privacy policy/i }),
        description: 'privacy policy checkbox by role',
      },
    ];
  }

  private continueButtonOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByRole('button', { name: /continue/i }),
        description: 'continue button by role',
      },
      {
        locator: this.page.locator('input[type="submit"][value="Continue"]'),
        description: 'legacy continue submit input',
      },
    ];
  }
}
