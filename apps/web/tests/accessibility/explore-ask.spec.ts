import { expect, test, type Locator, type Page } from '@playwright/test';

async function expectFocused(page: Page, locator: Locator) {
  await expect(locator).toBeFocused();
  expect(await page.evaluate(() => document.activeElement?.getAttribute('data-testid'))).toBe(
    await locator.getAttribute('data-testid'),
  );
}

test('Explore keeps a predictable keyboard order through navigation, search, and tag filters', async ({ page }) => {
  await page.goto('/explore');

  const headerOrder = [
    'link-logo',
    'link-nav-overview',
    'link-nav-how-it-works',
    'link-nav-explore',
    'link-nav-ask-me',
    'button-global-search',
    'button-theme-toggle',
    'link-nav-waitlist',
    'input-explore-search',
  ];
  for (const testId of headerOrder) {
    await page.keyboard.press('Tab');
    await expectFocused(page, page.getByTestId(testId));
  }

  await page.keyboard.type('private chat');
  await expect(page.getByTestId('link-area-private-chat')).toBeVisible();
  await expect(page.getByTestId('status-explore-results')).toContainText('area');

  await page.keyboard.press('Tab');
  await expectFocused(page, page.getByTestId('button-clear-explore-search'));
  await page.keyboard.press('Enter');
  await expectFocused(page, page.getByTestId('input-explore-search'));
  await expect(page.getByTestId('link-area-private-chat')).toBeVisible();

  await page.keyboard.press('Tab');
  const filters = page.getByRole('group', { name: 'Filter product areas by tag' });
  const allAreas = filters.getByRole('button', { name: 'All areas' });
  await expectFocused(page, allAreas);
  await page.keyboard.press('Tab');
  await expectFocused(page, filters.getByRole('button', { name: 'Home computer' }));
  await page.keyboard.press('Tab');
  await expectFocused(page, filters.getByRole('button', { name: 'Local models' }));
  await page.keyboard.press('Tab');
  const privateData = filters.getByRole('button', { name: 'Private data' });
  await expectFocused(page, privateData);
  await page.keyboard.press('Space');
  await expect(privateData).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('status-explore-results')).toContainText('Private data');
  await expect(page.getByTestId('link-area-me-home')).toBeVisible();
  await expect(page.getByTestId('link-area-private-chat')).toHaveCount(0);

  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Shift+Tab');
  await expectFocused(page, allAreas);
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('status-explore-results')).not.toContainText('Private data');
  await expect(page.getByTestId('link-area-private-chat')).toBeVisible();
});

test('Explore combines tags as active filters and lets users clear them individually', async ({ page }) => {
  await page.goto('/explore');

  const filters = page.getByRole('group', { name: 'Filter product areas by tag' });
  const allAreas = filters.getByRole('button', { name: 'All areas' });
  const chat = filters.getByRole('button', { name: 'Chat', exact: true });
  const householdProfiles = filters.getByRole('button', { name: 'Household profiles' });
  const status = page.getByTestId('status-explore-results');

  await expect(allAreas).toHaveAttribute('aria-pressed', 'true');
  await chat.click();
  await expect(chat).toHaveAttribute('aria-pressed', 'true');
  await expect(allAreas).toHaveAttribute('aria-pressed', 'false');
  await expect(status).toHaveText('2 areas · Filters: Chat');
  await expect(page.getByTestId('link-area-private-chat')).toBeVisible();
  await expect(page.getByTestId('link-area-mobile-companion')).toBeVisible();

  await householdProfiles.click();
  await expect(householdProfiles).toHaveAttribute('aria-pressed', 'true');
  await expect(status).toHaveText('1 area · Filters: Chat, Household profiles');
  await expect(page.getByTestId('link-area-mobile-companion')).toBeVisible();
  await expect(page.getByTestId('link-area-private-chat')).toHaveCount(0);

  await chat.click();
  await expect(chat).toHaveAttribute('aria-pressed', 'false');
  await expect(householdProfiles).toHaveAttribute('aria-pressed', 'true');
  await expect(status).toHaveText('1 area · Filters: Household profiles');
  await expect(page.getByTestId('link-area-mobile-companion')).toBeVisible();

  await allAreas.click();
  await expect(allAreas).toHaveAttribute('aria-pressed', 'true');
  await expect(householdProfiles).toHaveAttribute('aria-pressed', 'false');
  await expect(status).not.toContainText('Filters:');
  await expect(page.getByTestId('link-area-private-chat')).toBeVisible();
});

test('Explore combines search with multiple tags and preserves tags when search is cleared', async ({ page }) => {
  await page.goto('/explore');

  const search = page.getByTestId('input-explore-search');
  const filters = page.getByRole('group', { name: 'Filter product areas by tag' });
  const chat = filters.getByRole('button', { name: 'Chat', exact: true });
  const householdProfiles = filters.getByRole('button', { name: 'Household profiles' });
  const status = page.getByTestId('status-explore-results');
  const mobileCompanion = page.getByTestId('link-area-mobile-companion');
  const privateChat = page.getByTestId('link-area-private-chat');

  await chat.click();
  await householdProfiles.click();
  await expect(chat).toHaveAttribute('aria-pressed', 'true');
  await expect(householdProfiles).toHaveAttribute('aria-pressed', 'true');

  await search.fill('phone');
  await expect(mobileCompanion).toBeVisible();
  await expect(privateChat).toHaveCount(0);
  await expect(status).toHaveText('1 area · Filters: Chat, Household profiles');
  await expect(status).toHaveAttribute('aria-live', 'polite');
  await expect(status).toHaveAttribute('aria-atomic', 'true');

  await search.fill('private');
  await expect(mobileCompanion).toHaveCount(0);
  await expect(page.getByTestId('empty-explore')).toBeVisible();
  await expect(status).toHaveText('0 areas · Filters: Chat, Household profiles');

  await page.getByTestId('button-clear-explore-search').click();
  await expect(search).toBeFocused();
  await expect(search).toHaveValue('');
  await expect(chat).toHaveAttribute('aria-pressed', 'true');
  await expect(householdProfiles).toHaveAttribute('aria-pressed', 'true');
  await expect(mobileCompanion).toBeVisible();
  await expect(privateChat).toHaveCount(0);
  await expect(status).toHaveText('1 area · Filters: Chat, Household profiles');
});

test('Explore keeps search and multiple tags aligned with results and detail navigation', async ({ page }) => {
  await page.goto('/explore');

  const search = page.getByTestId('input-explore-search');
  const filters = page.getByRole('group', { name: 'Filter product areas by tag' });
  const chat = filters.getByRole('button', { name: 'Chat', exact: true });
  const householdProfiles = filters.getByRole('button', { name: 'Household profiles' });
  const status = page.getByTestId('status-explore-results');

  await search.fill('chat');
  await chat.click();
  await householdProfiles.click();
  await expect(status).toHaveText('1 area · Filters: Chat, Household profiles');
  await expect(page).toHaveURL(/\/explore\?q=chat&tag=Chat&tag=Household\+profiles$/);
  await expect(page.getByTestId('link-area-mobile-companion')).toBeVisible();
  await expect(page.getByTestId('link-area-private-chat')).toHaveCount(0);

  await page.getByTestId('link-area-mobile-companion').click();
  await expect(page).toHaveURL(/\/explore\/mobile-companion\?q=chat&tag=Chat&tag=Household\+profiles$/);
  const backToResults = page.getByRole('link', { name: 'All product areas' });
  await expect(backToResults).toHaveAttribute('href', '/explore?q=chat&tag=Chat&tag=Household+profiles');
  await backToResults.click();

  await expect(search).toHaveValue('chat');
  await expect(chat).toHaveAttribute('aria-pressed', 'true');
  await expect(householdProfiles).toHaveAttribute('aria-pressed', 'true');
  await expect(status).toHaveText('1 area · Filters: Chat, Household profiles');
  await expect(page.getByTestId('link-area-mobile-companion')).toBeVisible();
  await expect(page.getByTestId('link-area-private-chat')).toHaveCount(0);

  await householdProfiles.click();
  await expect(householdProfiles).toHaveAttribute('aria-pressed', 'false');
  await expect(status).toHaveText('2 areas · Filters: Chat');
  await expect(page).toHaveURL(/\/explore\?q=chat&tag=Chat$/);
  await expect(page.getByTestId('link-area-mobile-companion')).toBeVisible();
  await expect(page.getByTestId('link-area-private-chat')).toBeVisible();
});

test('Explore shows and highlights the matching passage for each search result', async ({ page }) => {
  await page.goto('/explore');
  const search = page.getByTestId('input-explore-search');
  const passage = page.getByTestId('match-passage-private-chat');

  await search.fill('private chat');
  await expect(passage).toContainText(
    'People may want to ask sensitive questions without sending everyday private chat history to a cloud provider.',
  );
  await expect(passage.locator('span')).toContainText('Problem');
  await expect(passage.locator('mark')).toHaveText('private chat');

  await search.fill('');
  await expect(page.locator('[data-testid^="match-passage-"]')).toHaveCount(0);
});

test('Explore announces empty results and clears filters with focus returned to search', async ({ page }) => {
  await page.goto('/explore');
  const search = page.getByTestId('input-explore-search');
  await search.focus();
  await page.keyboard.type('no-such-product-area-xyz');
  await expect(page.getByTestId('status-explore-results')).toHaveText('0 areas');
  await expect(page.getByTestId('empty-explore')).toBeVisible();

  await page.keyboard.press('Tab');
  await expectFocused(page, page.getByTestId('button-clear-explore-search'));
  await page.keyboard.press('Tab');

  const filterButtons = page.getByRole('group', { name: 'Filter product areas by tag' }).getByRole('button');
  await expectFocused(page, filterButtons.first());
  for (let index = 0; index < await filterButtons.count(); index += 1) {
    await page.keyboard.press('Tab');
  }

  const clearFilters = page.getByTestId('button-clear-explore-filters');
  await expectFocused(page, clearFilters);
  await page.keyboard.press('Enter');

  await expectFocused(page, search);
  await expect(page.getByTestId('empty-explore')).toHaveCount(0);
  await expect(page.getByTestId('status-explore-results')).not.toContainText('0 areas');
  await expect(page.getByTestId('link-area-me-home')).toBeVisible();
  await expect(page.getByTestId('status-explore-results')).toHaveAttribute('aria-live', 'polite');
});

test('Ask supports keyboard prompt selection, submission, validation, announcements, and clearing', async ({ page }) => {
  await page.goto('/ask');

  const firstPrompt = page.getByTestId('button-prompt-0');
  const secondPrompt = page.getByTestId('button-prompt-1');
  const thirdPrompt = page.getByTestId('button-prompt-2');
  const question = page.getByTestId('input-ask-question');
  const send = page.getByTestId('button-ask-send');
  const clear = page.getByTestId('button-clear-chat');
  const conversation = page.getByTestId('chat-transcript');

  await firstPrompt.focus();
  await page.keyboard.press('Enter');
  await expect(question).toHaveValue('Where are private chats processed?');

  await page.keyboard.press('Tab');
  await expectFocused(page, secondPrompt);
  await page.keyboard.press('Enter');
  await expect(question).toHaveValue('What happens when a task needs an outside service?');

  await page.keyboard.press('Tab');
  await expectFocused(page, thirdPrompt);
  await page.keyboard.press('Tab');
  await expectFocused(page, clear);
  await page.keyboard.press('Tab');
  await expectFocused(page, question);
  await page.keyboard.press('Tab');
  await expectFocused(page, send);
  await page.keyboard.press('Enter');

  await expect(conversation).toContainText('What happens when a task needs an outside service?');
  await expect(conversation.getByRole('article', { name: 'Me answered' })).toHaveCount(1);
  await expect(conversation).toHaveAttribute('aria-live', 'polite');
  await expect(question).toHaveValue('');

  await page.keyboard.press('Shift+Tab');
  await expectFocused(page, question);
  await page.keyboard.press('Enter');
  await expectFocused(page, question);
  await expect(question).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('status')).toContainText('Write a question first.');

  await page.keyboard.press('Shift+Tab');
  await expectFocused(page, clear);
  await page.keyboard.press('Enter');
  await expect(conversation.getByRole('article')).toHaveCount(0);
  await expect(page.getByRole('status')).toContainText('Messages cleared. Nothing was saved.');
  await expectFocused(page, clear);
});

test('Ask keeps each new exchange visible when the reader is at the latest message', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/ask');

  const conversation = page.getByTestId('chat-transcript');
  const question = page.getByTestId('input-ask-question');
  const send = page.getByTestId('button-ask-send');

  for (let index = 0; index < 10; index += 1) {
    await question.fill(`How does private chat work? ${index}`);
    await send.click();
  }

  const latestAnswer = conversation.getByRole('article', { name: 'Me answered' }).last();
  await expect(latestAnswer).toBeVisible();
  const visibility = await conversation.evaluate((element, message) => {
    const container = element.getBoundingClientRect();
    const answer = message.getBoundingClientRect();
    return {
      scrollBottom: element.scrollTop + element.clientHeight,
      scrollHeight: element.scrollHeight,
      answerTop: answer.top,
      answerBottom: answer.bottom,
      containerTop: container.top,
      containerBottom: container.bottom,
    };
  }, await latestAnswer.elementHandle());
  expect(visibility.scrollBottom).toBeGreaterThanOrEqual(visibility.scrollHeight - 1);
  expect(visibility.answerTop).toBeGreaterThanOrEqual(visibility.containerTop);
  expect(visibility.answerBottom).toBeLessThanOrEqual(visibility.containerBottom);
});

test('Ask does not jump to new messages while the reader is viewing earlier messages', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/ask');

  const conversation = page.getByTestId('chat-transcript');
  const question = page.getByTestId('input-ask-question');
  const send = page.getByTestId('button-ask-send');

  for (let index = 0; index < 10; index += 1) {
    await question.fill(`How does private chat work? ${index}`);
    await send.click();
  }
  await conversation.evaluate((element) => { element.scrollTop = 0; });
  await expect.poll(() => conversation.evaluate((element) => element.scrollTop)).toBe(0);
  const earlierQuestion = conversation.getByRole('article', { name: 'You asked' }).first();
  await expect(earlierQuestion).toBeVisible();

  await question.fill('How does the family feed work?');
  await send.click();
  await expect(conversation.getByRole('article', { name: 'Me answered' })).toHaveCount(11);
  await expect.poll(() => conversation.evaluate((element) => element.scrollTop)).toBe(0);
  await expect(earlierQuestion).toBeVisible();

  const latestAnswer = conversation.getByRole('article', { name: 'Me answered' }).last();
  const answerBelowViewport = await conversation.evaluate((element, message) => {
    const container = element.getBoundingClientRect();
    const answer = message.getBoundingClientRect();
    return answer.bottom > container.bottom;
  }, await latestAnswer.elementHandle());
  expect(answerBelowViewport).toBe(true);
});

test('Explore and Ask reflow at a 200% zoom-equivalent width without horizontal page scrolling', async ({ page }) => {
  // A 1280 CSS-pixel desktop viewport becomes 640 CSS pixels wide at 200% zoom.
  await page.setViewportSize({ width: 640, height: 900 });

  const expectNoPageHorizontalOverflow = async () => {
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    expect(dimensions.document, 'document should not scroll horizontally').toBeLessThanOrEqual(dimensions.viewport);
    expect(dimensions.body, 'page content should not scroll horizontally').toBeLessThanOrEqual(dimensions.viewport);
  };
  const expectReachable = async (locator: Locator) => {
    await expect(locator).toBeVisible();
    await locator.focus();
    await expect(locator).toBeFocused();
    await expect(locator).toBeInViewport();
    const bounds = await locator.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(640);
  };

  await page.goto('/explore');
  await expectNoPageHorizontalOverflow();
  await expectReachable(page.getByTestId('input-explore-search'));
  const filters = page.getByRole('group', { name: 'Filter product areas by tag' });
  const filterDimensions = await filters.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(filterDimensions.scrollWidth, 'filter controls should wrap rather than scroll sideways')
    .toBeLessThanOrEqual(filterDimensions.clientWidth);
  const filterButtons = filters.getByRole('button');
  for (let index = 0; index < await filterButtons.count(); index += 1) {
    await expectReachable(filterButtons.nth(index));
    await expectNoPageHorizontalOverflow();
  }

  await page.goto('/ask');
  await expectNoPageHorizontalOverflow();
  for (const prompt of await page.getByRole('group', { name: 'Suggested questions' }).getByRole('button').all()) {
    await expectReachable(prompt);
    await expectNoPageHorizontalOverflow();
  }
  await expectReachable(page.getByTestId('button-clear-chat'));
  await expectReachable(page.getByTestId('input-ask-question'));
  await expectReachable(page.getByTestId('button-ask-send'));
  await expectNoPageHorizontalOverflow();
});

test('Explore and Ask text, controls, and keyboard focus meet contrast thresholds in both themes', async ({ page }) => {
  await page.goto('/explore');
  const themeToggle = page.getByTestId('button-theme-toggle');

  for (const theme of ['light', 'dark'] as const) {
    const isDark = await page.locator('html').evaluate((element) => element.classList.contains('dark'));
    if ((theme === 'dark') !== isDark) {
      await themeToggle.click();
    }
    expect(await page.locator('html').evaluate((element) => element.classList.contains('dark'))).toBe(theme === 'dark');

    for (const route of ['/explore', '/ask']) {
      await page.goto(route);
      expect(await page.locator('html').evaluate((element) => element.classList.contains('dark'))).toBe(theme === 'dark');

      const textContrasts = await page.evaluate(() => {
        const probe = document.createElement('div');
        probe.className = 'accessibility-page';
        document.body.append(probe);
        const readTokenColor = (name: string) => {
          probe.style.color = `hsl(${getComputedStyle(probe).getPropertyValue(name)})`;
          const color = getComputedStyle(probe).color;
          return color;
        };
        const rgb = (color: string) => color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
        const luminance = (color: string) => {
          const [red, green, blue] = rgb(color).map((channel) => {
            const srgb = channel / 255;
            return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
          });
          return red * 0.2126 + green * 0.7152 + blue * 0.0722;
        };
        const ratio = (foreground: string, background: string) => {
          const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
          return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
        };
        const pairs: [string, string, string][] = [
          ['body text / page', '--foreground', '--background'],
          ['body text / card', '--foreground', '--card'],
          ['muted text / page', '--muted-foreground', '--background'],
          ['muted text / card', '--muted-foreground', '--card'],
          ['filter label / secondary control', '--muted-foreground', '--secondary'],
          ['accent text / page', '--accent', '--background'],
          ['accent text / card', '--accent', '--card'],
          ['selected filter text / accent control', '--accent-foreground', '--accent'],
          ['primary control text / primary control', '--primary-foreground', '--primary'],
          ['secondary control text / secondary control', '--secondary-foreground', '--secondary'],
        ];
        const contrasts = pairs.map(([label, foreground, background]) => ({
          label,
          ratio: ratio(readTokenColor(foreground), readTokenColor(background)),
        }));
        probe.remove();
        return contrasts;
      });
      for (const { label, ratio } of textContrasts) {
        expect(ratio, `${theme} theme ${label} contrast`).toBeGreaterThanOrEqual(4.5);
      }

      const nonTextContrasts = await page.evaluate(() => {
        const probe = document.createElement('div');
        probe.className = 'accessibility-page';
        document.body.append(probe);
        const tokenColor = (name: string) => {
          probe.style.color = `hsl(${getComputedStyle(probe).getPropertyValue(name)})`;
          const color = getComputedStyle(probe).color;
          return color;
        };
        const rgb = (color: string) => color.match(/[\d.]+/g)!.slice(0, 3).map(Number);
        const luminance = (color: string) => {
          const [red, green, blue] = rgb(color).map((channel) => {
            const srgb = channel / 255;
            return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
          });
          return red * 0.2126 + green * 0.7152 + blue * 0.0722;
        };
        const ratio = (first: string, second: string) => {
          const [lighter, darker] = [luminance(first), luminance(second)].sort((a, b) => b - a);
          return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
        };
        const contrasts = [
          ['input edge / page', '--input', '--background'],
          ['input edge / card', '--input', '--card'],
          ['filter edge / page', '--border', '--background'],
          ['filter edge / card', '--border', '--card'],
          ['focus ring / page', '--accent', '--background'],
          ['focus ring / card', '--accent', '--card'],
        ].map(([label, foreground, background]) => ({
          label,
          ratio: ratio(tokenColor(foreground), tokenColor(background)),
        }));
        probe.remove();
        return contrasts;
      });
      for (const { label, ratio } of nonTextContrasts) {
        expect(ratio, `${theme} theme ${label} contrast`).toBeGreaterThanOrEqual(3);
      }

      if (route === '/explore') {
        const search = page.getByTestId('input-explore-search');
        await search.fill('keyboard focus');
        const controls = [
          search,
          page.getByRole('button', { name: 'Home computer' }),
          page.getByTestId('button-clear-explore-search'),
          page.getByTestId('button-clear-explore-filters'),
        ];
        for (const control of controls) {
          await control.focus();
          await expect(control).toBeFocused();
          const focusStyle = await control.evaluate((element) => {
            const style = getComputedStyle(element);
            const probe = document.createElement('div');
            probe.className = 'accessibility-page';
            document.body.append(probe);
            const tokenColor = (name: string) => {
              probe.style.color = `hsl(${getComputedStyle(probe).getPropertyValue(name)})`;
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
            const contrast = (background: string) => {
              const [lighter, darker] = [luminance(style.outlineColor), luminance(background)].sort((a, b) => b - a);
              return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
            };
            const result = {
              visible: element.matches(':focus-visible'),
              outlineStyle: style.outlineStyle,
              outlineWidth: style.outlineWidth,
              pageContrast: contrast(tokenColor('--background')),
              cardContrast: contrast(tokenColor('--card')),
            };
            probe.remove();
            return result;
          });
          expect(focusStyle.visible, `${theme} theme focus-visible state`).toBe(true);
          expect(focusStyle.outlineStyle, `${theme} theme focus outline style`).toBe('solid');
          expect(Number.parseFloat(focusStyle.outlineWidth), `${theme} theme focus outline width`).toBeGreaterThanOrEqual(2);
          expect(focusStyle.pageContrast, `${theme} theme focus ring / page`).toBeGreaterThanOrEqual(3);
          expect(focusStyle.cardContrast, `${theme} theme focus ring / card`).toBeGreaterThanOrEqual(3);
        }
      } else {
        const controls = [
          page.getByTestId('button-prompt-0'),
          page.getByTestId('button-clear-chat'),
          page.getByTestId('input-ask-question'),
          page.getByTestId('button-ask-send'),
        ];
        for (const control of controls) {
          await control.focus();
          await expect(control).toBeFocused();
          const focusStyle = await control.evaluate((element) => {
            const style = getComputedStyle(element);
            const probe = document.createElement('div');
            probe.className = 'accessibility-page';
            document.body.append(probe);
            const tokenColor = (name: string) => {
              probe.style.color = `hsl(${getComputedStyle(probe).getPropertyValue(name)})`;
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
            const contrast = (background: string) => {
              const [lighter, darker] = [luminance(style.outlineColor), luminance(background)].sort((a, b) => b - a);
              return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
            };
            const result = {
              visible: element.matches(':focus-visible'),
              outlineStyle: style.outlineStyle,
              outlineWidth: style.outlineWidth,
              pageContrast: contrast(tokenColor('--background')),
              cardContrast: contrast(tokenColor('--card')),
            };
            probe.remove();
            return result;
          });
          expect(focusStyle.visible, `${theme} theme focus-visible state`).toBe(true);
          expect(focusStyle.outlineStyle, `${theme} theme focus outline style`).toBe('solid');
          expect(Number.parseFloat(focusStyle.outlineWidth), `${theme} theme focus outline width`).toBeGreaterThanOrEqual(2);
          expect(focusStyle.pageContrast, `${theme} theme focus ring / page`).toBeGreaterThanOrEqual(3);
          expect(focusStyle.cardContrast, `${theme} theme focus ring / card`).toBeGreaterThanOrEqual(3);
        }
      }
    }
  }
});
