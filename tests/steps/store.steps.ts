import { Config } from '@config/Config';
import { expect, Given, Then, When } from './fixtures';

Given('the user opens the store home page', async ({ app }) => {
  await app.homePage.open();
});

Given('the user is on the login page', async ({ app }) => {
  await app.loginPage.open();
});

Given('the user is on the registration page', async ({ app }) => {
  await app.registrationPage.open();
});

When('the user opens the account menu', async ({ app }) => {
  await app.header.openMyAccountMenu();
});

When('the user chooses the login option', async ({ app }) => {
  await app.header.goToLogin();
});

When('the user searches for {string} from the header', async ({ app }, productName: string) => {
  app.state.lastSearchTerm = productName;
  await app.header.searchFor(productName);
});

When(
  'the user logs in with email {string} and password {string}',
  async ({ app }, email: string, password: string) => {
    await app.loginPage.login(email, password);
  },
);

When('the user logs in with invalid credentials', async ({ app }) => {
  await app.loginPage.login(Config.invalidUser.email, Config.invalidUser.password);
});

When('the user adds the first listed product to the cart', async ({ app }) => {
  await app.productListingPage.addFirstProductToCart();
});

When('the user registers a new account', async ({ app }) => {
  const registeredUser = app.createRegistrationUser();
  await app.registrationPage.register(registeredUser);
});

Then('the login page is displayed', async ({ app }) => {
  await expect(app.page).toHaveURL(/route=account\/login/);
  await expect(app.page.getByRole('heading', { name: 'Returning Customer' })).toBeVisible();
});

Then('search results for {string} are shown', async ({ app }, productName: string) => {
  await expect(app.page).toHaveURL(new RegExp(`search=${productName}`, 'i'));
  await expect(app.page.locator('.product-thumb').first()).toBeVisible();
});

Then('a login warning is displayed', async ({ app }) => {
  await expect(app.page.locator('.alert-danger')).toBeVisible();
  await expect(app.page.locator('.alert-danger')).toContainText('Warning');
});

Then('the user remains on the login page', async ({ app }) => {
  await expect(app.page).toHaveURL(/route=account\/login/);
});

Then('the cart count is updated', async ({ app }) => {
  await expect(app.page.locator('#cart-total')).toContainText('1 item');
});

Then('the account creation success message is displayed', async ({ app }) => {
  await expect(app.page.getByRole('heading', { name: 'Your Account Has Been Created!' })).toBeVisible();
});
