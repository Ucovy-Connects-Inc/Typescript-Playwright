import { Locator, Page } from '@playwright/test';
import { Config } from '../config/Config';
import { Logger } from '../utils/Logger';

export type LocatorOption = {
  locator: Locator;
  description: string;
};

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(url: string): Promise<void> {
    Logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fill(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(text);
  }

  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return await locator.textContent() || '';
  }

  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async waitForElement(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  protected async clickAny(
    options: LocatorOption[],
    actionName: string,
    timeout: number = Config.TIMEOUT.ELEMENT,
  ): Promise<void> {
    const locator = await this.resolveVisibleLocator(options, actionName, timeout);
    await locator.click();
  }

  protected async fillAny(
    options: LocatorOption[],
    text: string,
    actionName: string,
    timeout: number = Config.TIMEOUT.ELEMENT,
  ): Promise<void> {
    const locator = await this.resolveVisibleLocator(options, actionName, timeout);
    await locator.clear();
    await locator.fill(text);
  }

  protected async resolveVisibleLocator(
    options: LocatorOption[],
    actionName: string,
    timeout: number = Config.TIMEOUT.ELEMENT,
  ): Promise<Locator> {
    const failures: string[] = [];

    for (let index = 0; index < options.length; index += 1) {
      const option = options[index];

      try {
        await option.locator.first().waitFor({ state: 'visible', timeout });
        if (index > 0) {
          Logger.warn(`Fallback locator used for ${actionName}: ${option.description}`);
        }
        return option.locator.first();
      } catch {
        failures.push(option.description);
      }
    }

    throw new Error(`Unable to resolve locator for ${actionName}. Tried: ${failures.join(', ')}`);
  }
}
