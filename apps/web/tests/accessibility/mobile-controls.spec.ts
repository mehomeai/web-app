import { expect, test, type Locator } from '@playwright/test';

async function expectVisibleFocus(locator: Locator) {
  await expect(locator).toBeFocused();
  expect(await locator.evaluate((element) => element.matches(':focus-visible'))).toBe(true);
  expect(await locator.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');
}

test('mobile menu opens, navigates, and closes with predictable keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/explore');

  const menuButton = page.getByTestId('button-menu');
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('link-logo')).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expectVisibleFocus(menuButton);
  await page.keyboard.press('Enter');

  const navigation = page.getByRole('navigation', { name: 'Primary site navigation' });
  await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toBeVisible();
  const overview = navigation.getByRole('link', { name: 'Overview' });
  await page.keyboard.press('Tab');
  await expectVisibleFocus(overview);
  await page.keyboard.press('Tab');
  await expectVisibleFocus(navigation.getByRole('link', { name: 'How it works' }));

  await page.keyboard.press('Escape');
  await expect(navigation).toHaveCount(0);
  await expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  await expectVisibleFocus(menuButton);

  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/$/);
  await expect(navigation).toHaveCount(0);
  await expectVisibleFocus(menuButton);
});

test('mobile navigation stays reachable at a 200% zoom-equivalent viewport', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 360 });
  await page.goto('/explore');

  const menuButton = page.getByTestId('button-menu');
  await menuButton.focus();
  await page.keyboard.press('Enter');

  const navigation = page.getByRole('navigation', { name: 'Primary site navigation' });
  const links = navigation.getByRole('link');
  await expect(navigation).toBeVisible();
  await expect(links).toHaveCount(5);

  for (let index = 0; index < await links.count(); index += 1) {
    const link = links.nth(index);
    await page.keyboard.press('Tab');
    await expectVisibleFocus(link);
    await expect(link).toBeInViewport();
    const bounds = await link.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(640);
    const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(pageWidth, 'mobile navigation should not create horizontal page scrolling').toBeLessThanOrEqual(640);
  }

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/signup$/);
  await expect(navigation).toHaveCount(0);
  await expectVisibleFocus(menuButton);
});

test('mobile site search supports keyboard results, Escape, and focus return', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/explore');

  const searchButton = page.getByTestId('button-global-search-mobile');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expectVisibleFocus(searchButton);
  await page.keyboard.press('Enter');

  const searchInput = page.getByTestId('input-global-search');
  await expect(searchInput).toBeFocused();
  await page.keyboard.type('waitlist');
  const closeButton = page.getByTestId('button-close-search');
  const waitlistResult = page.getByTestId('link-search--signup');
  await page.keyboard.press('Tab');
  await expectVisibleFocus(closeButton);
  await page.keyboard.press('Tab');
  await expectVisibleFocus(waitlistResult);
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.locator('#site-search-panel')).toHaveCount(0);
  await expectVisibleFocus(searchButton);

  await page.keyboard.press('Enter');
  await expect(searchInput).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#site-search-panel')).toHaveCount(0);
  await expectVisibleFocus(searchButton);
});
