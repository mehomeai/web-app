import { expect, test } from '@playwright/test';

test('a page render error shows a fallback and can recover', async ({ page }) => {
  await page.goto('/__test/error-boundary');

  await expect(
    page.getByRole('heading', { name: 'Something went wrong' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Something went wrong' }),
  ).toBeFocused();
  await expect(page.getByRole('alert')).toHaveText(
    'This part of the app hit an error. The rest of the app is still running.',
  );
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  await expect(page.getByTestId('error-boundary-recovered')).toHaveCount(0);

  await page.getByRole('button', { name: 'Try again' }).click();

  await expect(page.getByTestId('error-boundary-recovered')).toBeVisible();
});
