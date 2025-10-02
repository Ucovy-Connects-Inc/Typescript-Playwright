import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartTable: Locator;
  private readonly quantityInputs: Locator;
  private readonly updateButtons: Locator;
  private readonly removeButtons: Locator;
  private readonly checkoutButton: Locator;
  private readonly cartTotal: Locator;
  private readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTable = page.locator('.table-responsive');
    this.quantityInputs = page.locator('input[name^="quantity"]');
    this.updateButtons = page.locator('button[data-original-title="Update"]');
    this.removeButtons = page.locator('button[data-original-title="Remove"]');
    this.checkoutButton = page.locator('a:has-text("Checkout")');
    this.cartTotal = page.locator('.text-right:has-text("Total")');
    this.emptyCartMessage = page.locator('p:has-text("Your shopping cart is empty")');
  }

  async isCartEmpty(): Promise<boolean> {
    return await this.isVisible(this.emptyCartMessage);
  }

  async updateQuantity(index: number, quantity: number): Promise<void> {
    const quantityInput = this.quantityInputs.nth(index);
    await quantityInput.clear();
    await quantityInput.fill(quantity.toString());
    await this.click(this.updateButtons.nth(index));
    await this.page.waitForTimeout(2000);
  }

  async removeItem(index: number): Promise<void> {
    await this.click(this.removeButtons.nth(index));
    await this.page.waitForTimeout(2000);
  }

  async getCartTotal(): Promise<string> {
    return await this.getText(this.cartTotal);
  }

  async proceedToCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  async getItemCount(): Promise<number> {
    return await this.quantityInputs.count();
  }
}