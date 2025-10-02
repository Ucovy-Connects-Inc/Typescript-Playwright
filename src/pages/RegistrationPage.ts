
export class RegistrationPage {
  constructor(private page: import('@playwright/test').Page) {}

  async isFormDisplayed() {
    const heading = this.page.locator('//h1[text()="Register Account"]');
    await heading.waitFor({ state: 'visible', timeout: 10000 });
    return heading.isVisible();
  }
//Filling the registration form
  async fillRegistrationForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    password: string;
    confirmPassword: string;
  }) {
    await this.page.fill('input[name="firstname"]', data.firstName);
    await this.page.fill('input[name="lastname"]', data.lastName);
    await this.page.fill('input[name="email"]', data.email);
    await this.page.fill('input[name="telephone"]', data.telephone);
    await this.page.fill('input[name="password"]', data.password);
    await this.page.fill('input[name="confirm"]', data.confirmPassword);
  }

  async agreeToPrivacyPolicy() {
    await this.page.check('//input[@id="input-agree"]');
  }

  async clickContinue() {
    await this.page.click('input[type="submit"][value="Continue"]');
  }

  async getErrorMessages() {
    return this.page.$$eval('.text-danger', nodes => nodes.map(n => n.textContent?.trim() || ''));
  }

  async isSuccessMessageDisplayed() {
    return this.page.isVisible('.main-content h1:text("Your Account Has Been Created!")');
  }
}