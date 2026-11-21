import { Page, Locator, expect } from '@playwright/test';

export class SearchColleaguesPage {
  readonly page: Page;
  readonly searchColleaguesLink: Locator;
  readonly searchColleaguesHeading: Locator;
  readonly searchButton: Locator;
  readonly nameOrRoleField: Locator;
  readonly colleaguesCountBadge: Locator;
  readonly cardName: Locator;
  readonly colleagueCard: Locator;
  readonly paginationTotalCount: Locator;

  constructor(page: Page) {
    this.page = page;

    this.searchColleaguesLink = page
      .getByRole('link', { name: /search colleagues/i })
      .or(page.locator('a[href*="/search/colleagues"]'));

    this.searchColleaguesHeading = page.getByRole('heading', {
      name: /search colleagues/i,
    });
    this.searchButton = page.getByRole('button', { name: /search/i });
    this.nameOrRoleField = page.getByPlaceholder('Name or role');
    this.colleaguesCountBadge = page
      .getByRole('heading', { name: 'Colleagues', exact: true })
      .locator('..')
      .locator('div')
      .first();
    this.cardName = page
      .locator('div')
      .filter({ has: page.getByRole('heading', { name: 'Colleagues', exact: true }) })
      .locator('div')
      .nth(1)
      .locator('div')
      .first();
    this.colleagueCard = page
      .locator('main ul li')
      .filter({ has: page.locator('a[href*="/platform/profile/"]') });
    this.paginationTotalCount = page
      .locator('.sr-only')
      .filter({ hasText: /^Page \d+ of \d+\. Showing \d+ items of \d+\.$/ });
  }

  async clickSearchColleagues(): Promise<void> {
    await expect(this.searchColleaguesLink.first()).toBeVisible({ timeout: 15_000 });
    await this.searchColleaguesLink.first().click();
  }

  async waitForSearchColleaguesPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/search\/colleagues/, { timeout: 15_000 });
    await expect(this.searchColleaguesHeading).toBeVisible({ timeout: 15_000 });
  }

  async isSearchColleaguesPageVisible(): Promise<boolean> {
    return await this.searchColleaguesHeading.isVisible();
  }
}