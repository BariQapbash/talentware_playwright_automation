import { Given } from '@cucumber/cucumber';
import { LoginPage } from '../pages/LoginPage';
import { page } from './world';

Given('I am logged in as an Employee and on the {string} page', async function (pageName: string) {
  const loginPage = new LoginPage(page);

  // Navigate using BASE_URL from environment variables
  await loginPage.navigate();

  // Perform login using credentials securely loaded from .env
  const email = process.env.TEST_USER_EMAIL || '';
  const password = process.env.TEST_USER_PASSWORD || '';
  await loginPage.login(email, password);

  // Wait for redirection and network stabilization after login
  await page.waitForLoadState('networkidle');
});