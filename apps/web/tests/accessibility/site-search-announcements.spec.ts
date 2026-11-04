import { expect, test } from '@playwright/test';

test('global search announces the number of matching results', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('button-global-search').click();

  const searchInput = page.getByTestId('input-global-search');
  const announcement = page.getByTestId('status-global-search-results');
  await searchInput.fill('waitlist');

  await expect(page.getByTestId('link-search--signup')).toBeVisible();
  await expect(announcement).toHaveAttribute('aria-live', 'polite');
  await expect(announcement).toHaveAttribute('aria-atomic', 'true');
  await expect(announcement).toHaveText('1 result for waitlist.');
});

test('global product search shows and highlights the matching passage', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('button-global-search').click();

  await page.getByTestId('input-global-search').fill('private chat');
  const result = page.getByTestId('link-search--explore-private-chat');
  await expect(result).toContainText('Match · Problem:');
  await expect(result).toContainText(
    'People may want to ask sensitive questions without sending everyday private chat history to a cloud provider.',
  );
  await expect(result.locator('mark')).toHaveText('private chat');
});

test('global search announces no matches once without duplicating the visible message', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('button-global-search').click();

  const searchInput = page.getByTestId('input-global-search');
  const announcement = page.getByTestId('status-global-search-results');
  await page.evaluate(() => {
    const announcement = document.querySelector('[data-testid="status-global-search-results"]');
    const observed: string[] = [];
    document.documentElement.dataset.searchAnnouncements = JSON.stringify(observed);
    new MutationObserver(() => {
      const text = announcement?.textContent?.trim();
      if (text) {
        observed.push(text);
        document.documentElement.dataset.searchAnnouncements = JSON.stringify(observed);
      }
    }).observe(announcement!, { childList: true, characterData: true, subtree: true });
  });
  await searchInput.fill('no-matches-first');
  await searchInput.fill('no-such-page-123');

  await expect(announcement).toHaveText('No results for no-such-page-123.');
  await expect(page.getByText('No documented matches. Try “feed”, “home”, or “approval”.')).toBeVisible();
  await expect(page.locator('[aria-live="polite"][data-testid="status-global-search-results"]')).toHaveCount(1);
  await expect(page.locator('#search-results [role="status"]')).toHaveCount(0);
  await expect.poll(async () => page.locator('html').getAttribute('data-search-announcements'))
    .toBe(JSON.stringify(['No results for no-such-page-123.']));
});
