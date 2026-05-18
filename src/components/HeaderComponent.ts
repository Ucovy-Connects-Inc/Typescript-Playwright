import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class HeaderComponent extends BasePage {
  private readonly myAccountDropdown: Locator;
  private readonly registerLink: Locator;
  private readonly loginLink: Locator;
  private readonly searchBox: Locator;
  private readonly searchButton: Locator;
  private readonly cartCounter: Locator;

  constructor(page: Page) {
    super(page);
    this.myAccountDropdown = page.locator('//a[@role="button"]//span[contains(text(),"My account")]');
    this.registerLink = page.locator('//a[contains(text(),"Register")]');
    this.loginLink = page.locator('//a[contains(text(),"Login")]');
    this.searchBox = page.getByRole('textbox', { name: 'Search For Products' }).first();
    this.searchButton = page.locator('button.type-text').first();
    this.cartCounter = page.locator('#cart-total');
  }

  async openMyAccountMenu(): Promise<void> {
    await this.click(this.myAccountDropdown);
  }

  async goToLogin(): Promise<void> {
    await this.openMyAccountMenu();
    await this.click(this.loginLink);
  }

  async goToRegistration(): Promise<void> {
    await this.openMyAccountMenu();
    await this.click(this.registerLink);
  }

  async searchFor(productName: string): Promise<void> {
    await this.fill(this.searchBox, productName);
    await this.click(this.searchButton);
  }

  async getCartSummary(): Promise<string> {
    return this.getText(this.cartCounter);
  }
}
