import { Page } from '@playwright/test';
import { HeaderComponent } from '@components/HeaderComponent';
import { AccountPage } from '@pages/AccountPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { ProductListingPage } from '@pages/ProductListingPage';
import { RegistrationPage } from '@pages/RegistrationPage';
import { TestData } from '@utils/TestData';

export type RegistrationUser = {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
  confirmPassword: string;
};

type ScenarioState = {
  registeredUser?: RegistrationUser;
  lastSearchTerm?: string;
};

export class AppContext {
  readonly accountPage: AccountPage;
  readonly cartPage: CartPage;
  readonly checkoutPage: CheckoutPage;
  readonly header: HeaderComponent;
  readonly homePage: HomePage;
  readonly loginPage: LoginPage;
  readonly productListingPage: ProductListingPage;
  readonly registrationPage: RegistrationPage;
  readonly state: ScenarioState;

  constructor(readonly page: Page) {
    this.accountPage = new AccountPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutPage = new CheckoutPage(page);
    this.header = new HeaderComponent(page);
    this.homePage = new HomePage(page);
    this.loginPage = new LoginPage(page);
    this.productListingPage = new ProductListingPage(page);
    this.registrationPage = new RegistrationPage(page);
    this.state = {};
  }

  createRegistrationUser(): RegistrationUser {
    const email = TestData.generateUniqueEmail();
    const password = TestData.VALID_USER.password;
    const registeredUser: RegistrationUser = {
      firstName: TestData.VALID_USER.firstName,
      lastName: TestData.VALID_USER.lastName,
      email,
      telephone: TestData.VALID_USER.telephone,
      password,
      confirmPassword: password,
    };

    this.state.registeredUser = registeredUser;
    return registeredUser;
  }
}
