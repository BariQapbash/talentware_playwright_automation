import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Use resilient user-facing semantic locators (adjust regex if actual DOM labels differ)
    this.emailInput = page.getByRole('textbox', { name: /email|username/i });
    this.passwordInput = page.getByRole('textbox', { name: /password/i });
    this.loginButton = page.getByRole('button', { name: /login|sign in|log in/i });
  }

  /**
   * Navigate to the application base URL configured in .env
   */
  async navigate(): Promise<void> {
    const baseUrl = process.env.BASE_URL;
    if (!baseUrl) {
      throw new Error('BASE_URL is not defined in the environment variables.');
    }
    await this.page.goto(baseUrl);
  }

  /**
   * Fill credentials and submit the login form
   * @param email User email address
   * @param password User password
   */
  async login(email: string, password: string): Promise<void> {
    if (!email || !password) {
      throw new Error('Test user credentials (TEST_USER_EMAIL or TEST_USER_PASSWORD) are missing.');
    }
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}