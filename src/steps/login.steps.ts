import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../pages/LoginPage';
import { SearchColleaguesPage } from '../pages/SearchColleaguesPage';
import { page } from './world';

Given('I am logged in as an Employee and on the {string} page', async function (pageName: string) {
  const loginPage = new LoginPage(page);

  // Navigate using BASE_URL from environment variables
  await loginPage.navigate();

  // Perform login using credentials securely loaded from .env
  const email = process.env.TEST_USER_EMAIL || '';
  const password = process.env.TEST_USER_PASSWORD || '';
  await loginPage.login(email, password);

  // Wait for login redirection and DOM readiness instead of strict networkidle
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15_000 });
  await page.waitForLoadState('domcontentloaded');

  if (!pageName) {
    throw new Error('The expected page name must not be empty.');
  }
});
When('I click on the {string} button', async function (buttonName: string) {
  if (buttonName === 'Search colleagues') {
    const searchColleaguesPage = new SearchColleaguesPage(page);
    await searchColleaguesPage.clickSearchColleagues();
    await page.waitForLoadState('domcontentloaded');
    return;
  }

  throw new Error(`Unsupported button: "${buttonName}"`);
});

Then('I should see the {string} page', async function (expectedPageName: string) {
  if (expectedPageName === 'Search colleagues') {
    const searchColleaguesPage = new SearchColleaguesPage(page);

    await searchColleaguesPage.waitForSearchColleaguesPage();

    const isVisible = await searchColleaguesPage.isSearchColleaguesPageVisible();
    if (!isVisible) {
      throw new Error(`Expected to be on the "${expectedPageName}" page, but it is not visible.`);
    }
    return;
  }

  throw new Error(`Unsupported page: "${expectedPageName}"`);
});