import { Before, After } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

export let browser: Browser;
export let context: BrowserContext;
export let page: Page;

Before(async function () {
  // Run headless in CI environments (GitHub Actions), headed locally for debugging
  const isCI = Boolean(process.env.CI);
  browser = await chromium.launch({ headless: isCI });
  context = await browser.newContext();
  page = await context.newPage();
});

After(async function () {
  if (page) await page.close();
  if (context) await context.close();
  if (browser) await browser.close();
});