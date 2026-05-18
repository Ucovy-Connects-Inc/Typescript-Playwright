import { test as base, createBdd } from 'playwright-bdd';
import { AppContext } from '@bdd/AppContext';

type Fixtures = {
  app: AppContext;
};

export const test = base.extend<Fixtures>({
  app: async ({ page }, use) => {
    await use(new AppContext(page));
  },
});

export { expect } from '@playwright/test';
export const { Given, When, Then } = createBdd(test);
