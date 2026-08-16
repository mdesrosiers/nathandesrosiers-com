import { test, expect } from '@playwright/test';

test('detail page for an image project shows title, image, and description', async ({
  page,
}) => {
  await page.goto('/portfolio/placeholder-one');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Placeholder Project One',
  );
  await expect(page.getByAltText('Placeholder artwork one')).toBeVisible();
  await expect(
    page.getByText('A short placeholder description of the first project.'),
  ).toBeVisible();
});

test('detail page for a video project shows the video placeholder', async ({
  page,
}) => {
  await page.goto('/portfolio/placeholder-three');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Placeholder Project Three',
  );
  await expect(page.getByText('Video preview coming soon')).toBeVisible();
});

test('back link returns to the portfolio index', async ({ page }) => {
  await page.goto('/portfolio/placeholder-one');
  await page.getByRole('link', { name: /Back to Portfolio/ }).click();
  await expect(page).toHaveURL('/portfolio');
});
