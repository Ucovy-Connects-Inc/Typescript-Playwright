import { Locator, Page } from '@playwright/test';
import { BasePage, type LocatorOption } from '@pages/BasePage';

export class HeaderComponent extends BasePage {
  private readonly cartCounter: Locator;

  constructor(page: Page) {
    super(page);
    this.cartCounter = page.locator('#cart-total');
  }

  async openMyAccountMenu(): Promise<void> {
    await this.clickAny(this.myAccountMenuOptions(), 'open my account menu');
  }

  async goToLogin(): Promise<void> {
    await this.openMyAccountMenu();
    await this.clickAny(this.loginLinkOptions(), 'open login page');
  }

  async goToRegistration(): Promise<void> {
    await this.openMyAccountMenu();
    await this.clickAny(this.registerLinkOptions(), 'open registration page');
  }

  async searchFor(productName: string): Promise<void> {
    await this.fillAny(this.searchBoxOptions(), productName, 'fill search input');
    await this.clickAny(this.searchButtonOptions(), 'submit search');
  }

  async getCartSummary(): Promise<string> {
    return this.getText(this.cartCounter);
  }

  private myAccountMenuOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByRole('button', { name: /my account/i }),
        description: 'my account button by role',
      },
      {
        locator: this.page.locator('//a[@role="button"]//span[contains(text(),"My account")]'),
        description: 'legacy my account span locator',
      },
      {
        locator: this.page.getByText(/my account/i).first(),
        description: 'my account text fallback',
      },
    ];
  }

  private loginLinkOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByRole('link', { name: /login/i }),
        description: 'login link by role',
      },
      {
        locator: this.page.locator('//a[contains(text(),"Login")]'),
        description: 'legacy login text locator',
      },
    ];
  }

  private registerLinkOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByRole('link', { name: /register/i }),
        description: 'register link by role',
      },
      {
        locator: this.page.locator('//a[contains(text(),"Register")]'),
        description: 'legacy register text locator',
      },
    ];
  }

  private searchBoxOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByRole('textbox', { name: /search for products/i }),
        description: 'search input by accessible name',
      },
      {
        locator: this.page.locator('input[name="search"]'),
        description: 'search input by name attribute',
      },
    ];
  }

  private searchButtonOptions(): LocatorOption[] {
    return [
      {
        locator: this.page.getByRole('button', { name: /search/i }),
        description: 'search button by role',
      },
      {
        locator: this.page.locator('button.type-text'),
        description: 'legacy header search button',
      },
      {
        locator: this.page.locator('button:has(i.fa-search)'),
        description: 'icon-based search button fallback',
      },
    ];
  }
}
