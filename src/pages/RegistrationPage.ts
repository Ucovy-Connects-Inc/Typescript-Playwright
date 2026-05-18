
import { Locator, Page } from '@playwright/test';
import { Config } from '../config/Config';
import { BasePage } from './BasePage';

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
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly telephoneInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly privacyPolicyCheckbox: Locator;
  private readonly privacyPolicyLabel: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeading = page.getByRole('heading', { name: 'Register Account' });
    this.successHeading = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
    this.firstNameInput = page.locator('input[name="firstname"]');
    this.lastNameInput = page.locator('input[name="lastname"]');
    this.emailInput = page.locator('input[name="email"]');
    this.telephoneInput = page.locator('input[name="telephone"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.confirmPasswordInput = page.locator('input[name="confirm"]');
    this.privacyPolicyCheckbox = page.locator('#input-agree');
    this.privacyPolicyLabel = page.locator('label[for="input-agree"]');
    this.continueButton = page.locator('input[type="submit"][value="Continue"]');
  }

  async open(): Promise<void> {
    await this.navigate(`${Config.baseURL}/index.php?route=account/register`);
  }

  async isFormDisplayed(): Promise<boolean> {
    return this.isVisible(this.pageHeading);
  }

  async fillRegistrationForm(data: RegistrationData): Promise<void> {
    await this.fill(this.firstNameInput, data.firstName);
    await this.fill(this.lastNameInput, data.lastName);
    await this.fill(this.emailInput, data.email);
    await this.fill(this.telephoneInput, data.telephone);
    await this.fill(this.passwordInput, data.password);
    await this.fill(this.confirmPasswordInput, data.confirmPassword);
  }

  async agreeToPrivacyPolicy(): Promise<void> {
    await this.privacyPolicyLabel.click();
  }

  async clickContinue(): Promise<void> {
    await this.click(this.continueButton);
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
}
