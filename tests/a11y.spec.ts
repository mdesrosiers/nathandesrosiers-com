import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const paths = ['/', '/about', '/portfolio', '/portfolio/placeholder-one'];

for (const path of paths) {
  test(`no automatic accessibility violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
