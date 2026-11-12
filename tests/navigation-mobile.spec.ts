import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

const messages = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const entries: string[] = [];
  messages.set(page, entries);
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') entries.push(`${message.type()}: ${message.text()}`);
  });
  page.on('pageerror', error => entries.push(`pageerror: ${error.message}`));
  await page.goto('/');
  await expect.poll(() => page.locator('html').getAttribute('data-mobile-menu-open')).toBe('false');
});

test.afterEach(async ({ page }, testInfo) => {
  const entries = messages.get(page) || [];
  if (entries.length) await testInfo.attach('browser-warnings-and-errors', { body: entries.join('\n'), contentType: 'text/plain' });
  expect(entries, 'Browser warnings and errors').toEqual([]);
});

test('64px header remains reachable and opens a full-screen contact menu', async ({ page }) => {
  const header = page.getByRole('banner');
  const menuButton = page.getByRole('button', { name: 'Open menu', exact: true });
  await expect.poll(async () => (await header.boundingBox())?.height).toBe(64);
  const target = await menuButton.boundingBox();
  expect(target?.width).toBeGreaterThanOrEqual(48);
  expect(target?.height).toBeGreaterThanOrEqual(48);

  await page.evaluate(() => window.scrollTo(0, 1400));
  await expect.poll(async () => Math.round((await header.boundingBox())?.y || 0)).toBe(0);
  await expect.poll(async () => (await header.boundingBox())?.height).toBe(64);
  await menuButton.click();

  const dialog = page.getByRole('dialog', { name: 'MIKLOL navigation' });
  await expect(dialog).toBeVisible();
  const box = await dialog.boundingBox();
  expect(box?.x).toBe(0);
  expect(box?.y).toBe(0);
  expect(box?.width).toBe(390);
  expect(box?.height).toBe(844);
  const closeButton = dialog.getByRole('button', { name: 'Close menu' });
  expect((await closeButton.boundingBox())?.height).toBeGreaterThanOrEqual(48);
  for (const link of await dialog.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link').all()) {
    expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(48);
    expect(await link.evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(24);
  }
  await expect(dialog.getByRole('link', { name: 'Reserve a table' })).toBeVisible();
  await expect(dialog.locator('a[href="tel:+251921282925"]')).toHaveText('+251 92 128 2925');
  await expect(dialog.getByText('Bahir Dar, Kebele 14, around Nock')).toBeVisible();
  await expect(dialog.getByText(/Proposed hours.*08:00.*22:00/)).toBeInViewport();
  expect(await page.locator('main').evaluate(element => (element as HTMLElement).inert)).toBe(true);
  await expect(page.getByRole('navigation', { name: 'Quick actions' })).toBeHidden();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  expect(await page.locator('main').evaluate(element => (element as HTMLElement).inert)).toBe(false);
  await expect(menuButton).toBeFocused();
  await expect(page.getByRole('navigation', { name: 'Quick actions' })).toBeVisible();
});

test('bottom actions are large, directly connected, and hide at the reservation form', async ({ page }) => {
  const bar = page.getByRole('navigation', { name: 'Quick actions' });
  await expect(bar).toBeVisible();
  const actions = bar.getByRole('link');
  await expect(actions).toHaveCount(4);
  const boxes = await Promise.all((await actions.all()).map(link => link.boundingBox()));
  boxes.forEach(box => {
    expect(box?.height).toBeGreaterThanOrEqual(48);
    expect(box?.width).toBeGreaterThanOrEqual(48);
  });
  expect(boxes[0]!.width).toBeGreaterThan(Math.max(...boxes.slice(1).map(box => box!.width)));
  for (let index = 1; index < boxes.length; index++) {
    expect(boxes[index]!.x - boxes[index - 1]!.x - boxes[index - 1]!.width).toBeGreaterThanOrEqual(7.9);
  }
  await expect(bar.getByRole('link', { name: 'Call MIKLOL on +251 92 128 2925' })).toHaveAttribute('href', 'tel:+251921282925');
  await expect(bar.getByRole('link', { name: 'Open MIKLOL directions in Google Maps' })).toHaveAttribute('href', /https:\/\/www\.google\.com\/maps\/search\/\?api=1&query=MIKLOL%20Bahir%20Dar%20Kebele%2014%20around%20Nock/);
  expect(await bar.evaluate(element => parseFloat(getComputedStyle(element).paddingBottom))).toBeGreaterThanOrEqual(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await bar.getByRole('link', { name: 'Reserve', exact: true }).click();
  await expect(page.locator('[data-reservation-form]').first()).toBeInViewport();
  await expect(bar).toBeHidden();
});

test('quick actions hide behind the gallery lightbox and return after closing', async ({ page }) => {
  await page.locator('#gallery button').first().click();
  const lightbox = page.getByRole('dialog', { name: 'Enlarged restaurant photos' });
  await expect(lightbox).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Quick actions' })).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(lightbox).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Quick actions' })).toBeVisible();
});

test('quick actions hide for visual-viewport keyboard space and return when it closes', async ({ page }) => {
  const bar = page.getByRole('navigation', { name: 'Quick actions' });
  await expect(bar).toBeVisible();
  await page.evaluate(() => {
    const input = document.createElement('input');
    input.id = 'keyboard-geometry-test';
    input.type = 'tel';
    input.style.cssText = 'position:fixed;top:120px;left:20px;width:300px;height:52px;z-index:100;';
    document.body.append(input);
    input.focus();
    if (window.visualViewport) {
      Object.defineProperty(window.visualViewport, 'height', { configurable: true, get: () => 500 });
      window.visualViewport.dispatchEvent(new Event('resize'));
    }
  });
  await expect(bar).toBeHidden();
  await page.evaluate(() => {
    document.querySelector<HTMLInputElement>('#keyboard-geometry-test')?.blur();
    document.querySelector('#keyboard-geometry-test')?.remove();
    if (window.visualViewport) {
      Reflect.deleteProperty(window.visualViewport, 'height');
      window.visualViewport.dispatchEvent(new Event('resize'));
    }
  });
  await expect(bar).toBeVisible();
});
