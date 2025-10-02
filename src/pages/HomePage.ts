import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { Config } from '../config/Config';

export class HomePage extends BasePage {
  private readonly myAccountDropdown: Locator;
  private readonly registerLink: Locator;
  private readonly loginLink: Locator;
  private readonly searchBox: Locator;
  private readonly searchButton: Locator;
  private readonly cartIcon: Locator;
  private readonly cartCounter: Locator;

  constructor(page: Page) {
    super(page);
    this.myAccountDropdown = page.locator('//a[@role="button"]//span[contains(text(),"My account")]');
    this.registerLink = page.locator('//a[contains(text(),"Register")]');
    this.loginLink = page.locator('//a[contains(text(),"Login")]');
    this.searchBox = page.locator('input[name="search"]');
    this.searchButton = page.locator('button.type-text');
    this.cartIcon = page.locator('#cart');
    this.cartCounter = page.locator('#cart-total');
  }

  async open(): Promise<void> {
    await this.navigate(Config.BASE_URL);
  }

  async clickMyAccountDropdown(): Promise<void> {
    await this.click(this.myAccountDropdown);
  }

  async clickRegisterLink(): Promise<void> {
    await this.clickMyAccountDropdown();
    await this.click(this.registerLink);
  }

  async clickLoginLink(): Promise<void> {
    await this.clickMyAccountDropdown();
    await this.click(this.loginLink);
  }

  async searchProduct(productName: string): Promise<void> {
    await this.fill(this.searchBox, productName);
    await this.click(this.searchButton);
  }

  async getCartCount(): Promise<string> {
    return await this.getText(this.cartCounter);
  }

  async clickCart(): Promise<void> {
    await this.click(this.cartIcon);
  }

  async navigateToCategory(category: string): Promise<void> {
    const categoryLink = this.page.locator(`//a[contains(text(),"${category}")]`).first();
    await this.click(categoryLink);
  }
}