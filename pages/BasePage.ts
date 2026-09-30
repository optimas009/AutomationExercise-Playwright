import { Page } from '@playwright/test';

// The site is heavy with third-party ads that slow pages down and can cover
// elements, so they are blocked for every page object.
const AD_HOSTS = /googlesyndication|doubleclick|googleadservices|adservice\.google|fundingchoicesmessages/;

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  static async blockAds(page: Page): Promise<void> {
    await page.route(AD_HOSTS, (route) => route.abort());
  }

  // Some regions show a cookie-consent dialog on first visit.
  async dismissConsentIfShown(): Promise<void> {
    const consent = this.page.getByRole('button', { name: /^consent$/i });
    if (await consent.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await consent.click();
    }
  }
}
