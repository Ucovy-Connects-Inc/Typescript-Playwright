import { Page } from '@playwright/test';

export class TestHelpers {
  static async waitForPageLoad(page: Page) {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
  }

  static async takeScreenshot(page: Page, name: string){
    await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  static async scrollToElement(page: Page, selector: string){
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  static async clearLocalStorage(page: Page) {
    await page.evaluate(() => localStorage.clear());
  }

  static async clearSessionStorage(page: Page) {
    await page.evaluate(() => sessionStorage.clear());
  }

  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}