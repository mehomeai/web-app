import { expect, test } from '@playwright/test';

test('shared site navigation landmarks have distinct names on desktop and mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/explore');

  const desktopNavigation = page.getByRole('navigation', { name: 'Primary site navigation' });
  const footerNavigation = page.getByRole('navigation', { name: 'Footer navigation' });

  await expect(desktopNavigation).toBeVisible();
  await expect(desktopNavigation.getByRole('link', { name: 'Overview' })).toBeVisible();
  await expect(footerNavigation).toHaveCount(1);
  await expect(footerNavigation.getByRole('link', { name: 'Overview' })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/explore');

  await expect(page.getByTestId('button-menu')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Primary site navigation' })).toHaveCount(0);
  await expect(footerNavigation).toHaveCount(1);

  await page.getByTestId('button-menu').click();
  const mobileNavigation = page.getByRole('navigation', { name: 'Primary site navigation' });
  await expect(mobileNavigation).toBeVisible();
  await expect(mobileNavigation.getByRole('link', { name: 'Overview' })).toBeVisible();
  await expect(footerNavigation).toHaveCount(1);
});
