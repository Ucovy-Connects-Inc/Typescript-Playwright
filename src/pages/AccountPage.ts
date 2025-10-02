import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AccountPage extends BasePage {
  private readonly welcomeMessage: Locator;
  private readonly editAccountLink: Locator;
  private readonly changePasswordLink: Locator;
  private readonly addressBookLink: Locator;
  private readonly orderHistoryLink: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.locator('h2:has-text("My Account")');
    this.editAccountLink = page.locator('a:has-text("Edit Account")');
    this.changePasswordLink = page.locator('a:has-text("Password")');
    this.addressBookLink = page.locator('a:has-text("Address Book")');
    this.orderHistoryLink = page.locator('a:has-text("Order History")');
    this.logoutLink = page.locator('//a[contains(text(),"Logout")]').first();
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.isVisible(this.welcomeMessage);
  }

  async clickEditAccount(): Promise<void> {
    await this.click(this.editAccountLink);
  }

  async clickChangePassword(): Promise<void> {
    await this.click(this.changePasswordLink);
  }

  async clickAddressBook(): Promise<void> {
    await this.click(this.addressBookLink);
  }

  async clickOrderHistory(): Promise<void> {
    await this.click(this.orderHistoryLink);
  }

  async logout(): Promise<void> {
    await this.click(this.logoutLink);
  }

  async isAllMenuItemsVisible(): Promise<boolean> {
    const items = [
      this.editAccountLink,
      this.changePasswordLink,
      this.addressBookLink,
      this.orderHistoryLink,
    ];

    for (const item of items) {
      if (!(await this.isVisible(item))) {
        return false;
      }
    }
    return true;
  }
}