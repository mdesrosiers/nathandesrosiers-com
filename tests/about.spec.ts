import { test, expect } from '@playwright/test';

test('about page loads with heading and bio text', async ({ page }) => {
  await page.goto('/about');
  await expect(page).toHaveTitle(/About/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('About');
  await expect(page.getByText('Placeholder bio')).toBeVisible();
});
