import { Before, After } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

export let browser: Browser;
export let context: BrowserContext;
export let page: Page;

Before(async function () {
  browser = await chromium.launch({ headless: false }); // 设置为 false 可以看到浏览器运行过程
  context = await browser.newContext();
  page = await context.newPage();
});

After(async function () {
  if (page) await page.close();
  if (context) await context.close();
  if (browser) await browser.close();
});