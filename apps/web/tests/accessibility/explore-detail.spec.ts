import { expect, test, type Locator, type Page } from '@playwright/test';

const productAreas = [
  { route: '/explore/me-home', title: 'Me Home infrastructure' },
  { route: '/explore/private-chat', title: 'Private chat' },
  { route: '/explore/approved-connectors', title: 'Approved outside actions' },
];

const sectionHeadings = [
  'The problem',
  'The approach',
  'What the repo documents',
  'Tech stack & building blocks',
  'Continue exploring',
];

test('Explore restores search and selected tags from a product area, while a direct visit starts clear', async ({ page }) => {
  await page.goto('/explore');
  const search = page.getByTestId('input-explore-search');
  await search.fill('private chat');
  const chatTag = page.getByRole('group', { name: 'Filter product areas by tag' }).getByRole('button', { name: 'Chat', exact: true });
  await chatTag.click();
  await expect(page.getByTestId('link-area-private-chat')).toBeVisible();

  await page.getByTestId('link-area-private-chat').click();
  await expect(page).toHaveURL(/\/explore\/private-chat\?q=private\+chat&tag=Chat$/);
  await page.goBack();
  await expect(page.getByTestId('input-explore-search')).toHaveValue('private chat');
  await expect(chatTag).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('status-explore-restored')).toContainText('Restored search for private chat; selected tags: Chat');
  await expect(page.getByTestId('link-area-private-chat')).toBeVisible();

  await page.getByTestId('link-area-private-chat').click();
  await page.getByRole('link', { name: 'All product areas' }).click();
  await expect(page.getByTestId('input-explore-search')).toHaveValue('private chat');
  await expect(page.getByRole('group', { name: 'Filter product areas by tag' }).getByRole('button', { name: 'Chat', exact: true })).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/explore');
  await expect(page.getByTestId('input-explore-search')).toHaveValue('');
  await expect(page.getByRole('group', { name: 'Filter product areas by tag' }).getByRole('button', { name: 'All areas' })).toHaveAttribute('aria-pressed', 'true');
});

async function setTheme(page: Page, theme: 'light' | 'dark') {
  await page.goto(productAreas[0].route);
  const isDark = await page.locator('html').evaluate((element) => element.classList.contains('dark'));
  if ((theme === 'dark') !== isDark) {
    await page.getByTestId('button-theme-toggle').click();
  }
  await expect(page.locator('html')).toHaveClass(theme === 'dark' ? /dark/ : /^((?!dark).)*$/);
}

async function expectFocused(page: Page, locator: Locator) {
  await expect(locator).toBeFocused();
  expect(await locator.evaluate((element) => element.matches(':focus-visible'))).toBe(true);
}

async function expectVisibleFocusRing(page: Page, locator: Locator, theme: string) {
  const style = await locator.evaluate((element) => {
    const outline = getComputedStyle(element);
    const probe = document.createElement('div');
    probe.className = 'accessibility-page';
    document.body.append(probe);

    const colorForToken = (token: string) => {
      probe.style.color = `hsl(${getComputedStyle(probe).getPropertyValue(token)})`;
      return getComputedStyle(probe).color;
    };
    const rgb = (color: string) => color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
    const luminance = (color: string) => {
      const [red, green, blue] = rgb(color).map((channel) => {
        const srgb = channel / 255;
        return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
      });
      return red * 0.2126 + green * 0.7152 + blue * 0.0722;
    };
    const [lighter, darker] = [
      luminance(outline.outlineColor),
      luminance(colorForToken('--background')),
    ].sort((a, b) => b - a);
    const contrast = Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
    probe.remove();

    return {
      visible: element.matches(':focus-visible'),
      outlineStyle: outline.outlineStyle,
      outlineWidth: Number.parseFloat(outline.outlineWidth),
      outlineOffset: Number.parseFloat(outline.outlineOffset),
      contrast,
    };
  });

  expect(style.visible, `${theme} theme focus-visible state`).toBe(true);
  expect(style.outlineStyle, `${theme} theme focus outline style`).toBe('solid');
  expect(style.outlineWidth, `${theme} theme focus outline width`).toBeGreaterThanOrEqual(3);
  expect(style.outlineOffset, `${theme} theme focus outline offset`).toBeGreaterThanOrEqual(4);
  expect(style.contrast, `${theme} theme focus ring / page`).toBeGreaterThanOrEqual(3);
}

async function expectForcedColorsFocusRing(page: Page, locator: Locator) {
  const style = await locator.evaluate((element) => {
    const outline = getComputedStyle(element);
    const probe = document.createElement('div');
    probe.style.color = 'CanvasText';
    document.body.append(probe);
    const systemColor = getComputedStyle(probe).color;
    probe.remove();

    return {
      visible: element.matches(':focus-visible'),
      outlineStyle: outline.outlineStyle,
      outlineWidth: Number.parseFloat(outline.outlineWidth),
      outlineOffset: Number.parseFloat(outline.outlineOffset),
      outlineColor: outline.outlineColor,
      systemColor,
    };
  });

  expect(style.visible, 'forced-colors focus-visible state').toBe(true);
  expect(style.outlineStyle, 'forced-colors focus outline style').toBe('solid');
  expect(style.outlineWidth, 'forced-colors focus outline width').toBeGreaterThanOrEqual(3);
  expect(style.outlineOffset, 'forced-colors focus outline offset').toBeGreaterThanOrEqual(4);
  expect(style.outlineColor, 'forced-colors focus outline system color').toBe(style.systemColor);
}

async function expectHorizontallyInViewport(page: Page, locator: Locator) {
  const box = await locator.boundingBox();
  expect(box, 'element has a visible bounding box').not.toBeNull();
  const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(box!.x, 'element left edge stays in the viewport').toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width, 'element right edge stays in the viewport').toBeLessThanOrEqual(viewportWidth + 1);
}

test('product-area detail pages keep labeled headings and landmarks in both themes', async ({ page }) => {
  for (const theme of ['light', 'dark'] as const) {
    await setTheme(page, theme);

    for (const area of productAreas) {
      await page.goto(area.route);
      await expect(page.locator('html')).toHaveClass(theme === 'dark' ? /dark/ : /^((?!dark).)*$/);

      await expect(page.getByRole('banner')).toHaveCount(1);
      await expect(page.getByRole('main')).toHaveCount(1);
      await expect(page.getByRole('contentinfo')).toHaveCount(1);
      await expect(page.getByRole('navigation')).toHaveCount(3);
      await expect(page.getByRole('navigation', { name: 'Primary site navigation' })).toBeVisible();
      await expect(page.getByRole('navigation', { name: 'Footer navigation' })).toHaveCount(1);
      await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();

      await expect(page.getByRole('article', { name: area.title })).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 1, name: area.title })).toBeVisible();
      for (const heading of sectionHeadings) {
        await expect(page.getByRole('heading', { level: 2, name: heading })).toBeVisible();
      }
      await expect(page.getByRole('heading', { level: 3 })).toHaveCount(0);
    }
  }
});

test('product-area detail pages reflow at 200% zoom and narrow widths', async ({ page }) => {
  const viewports = [
    { label: '200% zoom from a 1280px viewport', width: 640 },
    { label: 'narrow viewport', width: 320 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: 900 });

    for (const area of productAreas) {
      await page.goto(area.route);
      await expect(page.getByRole('article', { name: area.title })).toBeVisible();

      const overflow = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        main: document.querySelector('main')?.scrollWidth,
      }));
      expect(overflow.document, `${viewport.label}: document has no horizontal overflow`).toBeLessThanOrEqual(overflow.viewport);
      expect(overflow.body, `${viewport.label}: body has no horizontal overflow`).toBeLessThanOrEqual(overflow.viewport);
      expect(overflow.main, `${viewport.label}: main content has no horizontal overflow`).toBeLessThanOrEqual(overflow.viewport);

      const headings = page.getByRole('article', { name: area.title }).getByRole('heading');
      for (let index = 0; index < await headings.count(); index += 1) {
        const heading = headings.nth(index);
        await expect(heading).toBeVisible();
        await expectHorizontallyInViewport(page, heading);
      }

      const continueRegion = page.getByRole('region', { name: 'Continue exploring' });
      await expect(continueRegion).toBeVisible();
      const relatedLinks = continueRegion.getByRole('link');
      const linkCount = await relatedLinks.count();
      expect(linkCount).toBeGreaterThan(0);

      await page.locator('body').evaluate((element) => (element as HTMLElement).focus());
      let focusedLink = false;
      for (let tab = 0; tab < 16; tab += 1) {
        await page.keyboard.press('Tab');
        if (await relatedLinks.first().evaluate((element) => element === document.activeElement)) {
          focusedLink = true;
          break;
        }
      }
      expect(focusedLink, `${viewport.label}: first related link is keyboard reachable`).toBe(true);

      for (let index = 0; index < linkCount; index += 1) {
        const link = relatedLinks.nth(index);
        if (index > 0) await page.keyboard.press('Tab');
        await expectFocused(page, link);
        await expect(link).toBeInViewport();
        await expectHorizontallyInViewport(page, link);
      }
    }
  }
});

test('product-area detail links keep keyboard focus visible in forced-colors mode', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });

  for (const area of productAreas) {
    await page.goto(area.route);
    await expect(page.evaluate(() => matchMedia('(forced-colors: active)').matches)).resolves.toBe(true);
    await page.locator('body').evaluate((element) => (element as HTMLElement).focus());

    for (const testId of [
      'link-logo',
      'link-nav-overview',
      'link-nav-how-it-works',
      'link-nav-explore',
      'link-nav-ask-me',
      'button-global-search',
      'button-theme-toggle',
      'link-nav-waitlist',
    ]) {
      await page.keyboard.press('Tab');
      await expectFocused(page, page.getByTestId(testId));
    }

    await page.keyboard.press('Tab');
    const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'All product areas' });
    await expectFocused(page, breadcrumb);
    await expectForcedColorsFocusRing(page, breadcrumb);

    await page.keyboard.press('Tab');
    const continueExploring = page.getByRole('region', { name: 'Continue exploring' }).getByRole('link').first();
    await expectFocused(page, continueExploring);
    await expectForcedColorsFocusRing(page, continueExploring);
  }
});

test('product-area detail links keep keyboard order and visible focus in both themes', async ({ page }) => {
  const headerOrder = [
    'link-logo',
    'link-nav-overview',
    'link-nav-how-it-works',
    'link-nav-explore',
    'link-nav-ask-me',
    'button-global-search',
    'button-theme-toggle',
    'link-nav-waitlist',
  ];

  for (const theme of ['light', 'dark'] as const) {
    await setTheme(page, theme);

    for (const area of productAreas) {
      await page.goto(area.route);
      await page.locator('body').evaluate((element) => (element as HTMLElement).focus());

      for (const testId of headerOrder) {
        await page.keyboard.press('Tab');
        await expectFocused(page, page.getByTestId(testId));
      }

      await page.keyboard.press('Tab');
      const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'All product areas' });
      await expectFocused(page, breadcrumb);
      await expectVisibleFocusRing(page, breadcrumb, theme);

      await page.keyboard.press('Tab');
      const continueExploring = page.getByRole('region', { name: 'Continue exploring' }).getByRole('link').first();
      await expectFocused(page, continueExploring);
      await expectVisibleFocusRing(page, continueExploring, theme);
    }
  }
});
