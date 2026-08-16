import { test, expect } from '@playwright/test';

test('portfolio page lists all placeholder projects', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page).toHaveTitle(/Portfolio/);
  await expect(
    page.getByRole('heading', { name: 'Placeholder Project One' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Placeholder Project Two' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Placeholder Project Three' }),
  ).toBeVisible();
});

test('project cards link to their detail pages', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(
    page.getByRole('link', { name: /Placeholder Project One/ }),
  ).toHaveAttribute('href', '/portfolio/placeholder-one');
});
