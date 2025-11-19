import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductListingPage extends BasePage {
  private readonly productItems: Locator;
  private readonly sortDropdown: Locator;
  private readonly addToCartButtons: Locator;
  private readonly productTitles: Locator;
  private readonly productPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.productItems = page.locator('.product-thumb');
    this.sortDropdown = page.locator('#input-sort');
    this.addToCartButtons = page.locator('button:has-text("Add to Cart")');
    this.productTitles = page.locator('.product-thumb h4 a');
    this.productPrices = page.locator('.price-new');
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: option });
    await this.page.waitForTimeout(2000); // Wait for sorting to apply
  }

  async addFirstProductToCart(): Promise<void> {
    await this.click(this.addToCartButtons.first());
    await this.page.waitForTimeout(1000);
  }

  async addProductToCartByIndex(index: number): Promise<void> {
    await this.click(this.addToCartButtons.nth(index));
    await this.page.waitForTimeout(1000);
  }

  async getProductPrices(): Promise<number[]> {
    const prices: number[] = [];
    const priceElements = await this.productPrices.all();
    
    for (const priceElement of priceElements) {
      const priceText = await priceElement.textContent();
      if (priceText) {
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        prices.push(price);
      }
    }
    return prices;
  }

  async verifyPriceSorting(ascending: boolean = true): Promise<boolean> {
    const prices = await this.getProductPrices();
    
    for (let i = 0; i < prices.length - 1; i++) {
      if (ascending && prices[i] > prices[i + 1]) {
        return false;
      }
      if (!ascending && prices[i] < prices[i + 1]) {
        return false;
      }
    }
    return true;
  }

  async clickProductByIndex(index: number): Promise<void> {
    await this.click(this.productTitles.nth(index));
  }
}