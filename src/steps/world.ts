import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

// Set global Cucumber step timeout to 30 seconds (default is 5 seconds)
setDefaultTimeout(30_000);

export let browser: Browser;
export let context: BrowserContext;
export let page: Page;
let tracingStarted = false;

Before(async function () {
  const isCI = Boolean(process.env.CI);
  browser = await chromium.launch({ headless: isCI });
  context = await browser.newContext();
  page = await context.newPage();
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  tracingStarted = true;
});

After(async function ({ pickle }) {
  try {
    if (tracingStarted) {
      const traceDirectory = join(process.cwd(), 'test-results', 'traces');
      const tracePath = join(traceDirectory, `${pickle.id}.zip`);
      await mkdir(traceDirectory, { recursive: true });
      await context.tracing.stop({ path: tracePath });
      tracingStarted = false;
      await this.attach(await readFile(tracePath), {
        mediaType: 'application/zip',
        fileName: `trace-${pickle.id}.zip`,
      });
    }
  } finally {
    if (page) await page.close();
    if (context) await context.close();
    if (browser) await browser.close();
  }
});