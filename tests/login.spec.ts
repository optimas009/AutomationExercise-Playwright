import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { env } from '../utils/env';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await BasePage.blockAds(page);
  });

  test('registered user can log in with valid credentials', async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);

    await test.step('Launch the website', async () => {
      await home.open();
    });

    await test.step('Navigate to the Login page', async () => {
      await home.goToLogin();
      await login.expectLoaded();
    });

    await test.step('Enter registered email and password, then submit', async () => {
      await login.login(env.email, env.password);
    });

    await test.step('Verify that the login was successful', async () => {
      await expect(page).not.toHaveURL(/\/login/);
      await home.expectLoggedInAs(env.name);
      await expect(login.errorMessage).toBeHidden();
    });
  });

  test('login is rejected with a wrong password', async ({ page }) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);

    await home.open();
    await home.goToLogin();
    await login.expectLoaded();
    await login.login(env.email, `${env.password}-wrong`);

    await expect(login.errorMessage).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
    await expect(home.logoutLink).toBeHidden();
  });
});
