import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private readonly billingFirstName: Locator;
  private readonly billingLastName: Locator;
  private readonly billingAddress: Locator;
  private readonly billingCity: Locator;
  private readonly billingPostcode: Locator;
  private readonly billingCountry: Locator;
  private readonly billingState: Locator;
  private readonly continueButton: Locator;
  private readonly confirmOrderButton: Locator;
  private readonly orderSummary: Locator;

  constructor(page: Page) {
    super(page);
    this.billingFirstName = page.locator('#input-payment-firstname');
    this.billingLastName = page.locator('#input-payment-lastname');
    this.billingAddress = page.locator('#input-payment-address-1');
    this.billingCity = page.locator('#input-payment-city');
    this.billingPostcode = page.locator('#input-payment-postcode');
    this.billingCountry = page.locator('#input-payment-country');
    this.billingState = page.locator('#input-payment-zone');
    this.continueButton = page.locator('#button-save');
    this.confirmOrderButton = page.locator('#button-confirm');
    this.orderSummary = page.locator('.table-responsive');
  }

  async fillBillingDetails(data: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postCode: string;
    country: string;
    state: string;
  }): Promise<void> {
    if (await this.isVisible(this.billingFirstName)) {
      await this.fill(this.billingFirstName, data.firstName);
      await this.fill(this.billingLastName, data.lastName);
      await this.fill(this.billingAddress, data.address);
      await this.fill(this.billingCity, data.city);
      await this.fill(this.billingPostcode, data.postCode);
      await this.billingCountry.selectOption({ label: data.country });
      await this.page.waitForTimeout(1000);
      await this.billingState.selectOption({ label: data.state });
    }
  }

  async clickContinue(): Promise<void> {
    if (await this.isVisible(this.continueButton)) {
      await this.click(this.continueButton);
      await this.page.waitForTimeout(2000);
    }
  }

  async confirmOrder(): Promise<void> {
    await this.click(this.confirmOrderButton);
  }

  async isOrderSummaryDisplayed(): Promise<boolean> {
    return await this.isVisible(this.orderSummary);
  }
}