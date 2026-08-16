import { test, expect } from '@playwright/test';

test('home page loads with nav and heading', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Home/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Nathan Desrosiers',
  );
});

test('nav exposes links to about and portfolio', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('link', { name: 'About', exact: true }),
  ).toHaveAttribute('href', '/about');
  await expect(
    page.getByRole('link', { name: 'Portfolio', exact: true }),
  ).toHaveAttribute('href', '/portfolio');
});
