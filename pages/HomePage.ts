import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly signupLoginLink: Locator;
  readonly logoutLink: Locator;
  readonly loggedInAs: Locator;

  constructor(page: Page) {
    super(page);
    this.signupLoginLink = page.getByRole('link', { name: 'Signup / Login' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.loggedInAs = page.locator('li', { hasText: 'Logged in as' });
  }

  async open(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.dismissConsentIfShown();
    await expect(this.page).toHaveTitle(/Automation Exercise/);
  }

  async goToLogin(): Promise<void> {
    await this.signupLoginLink.click();
  }

  async expectLoggedInAs(name: string): Promise<void> {
    await expect(this.loggedInAs).toBeVisible();
    await expect(this.loggedInAs).toContainText(`Logged in as ${name}`);
    await expect(this.logoutLink).toBeVisible();
  }
}
