import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });

const browserErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
});

test.afterEach(async ({ page }, testInfo) => {
  const errors = browserErrors.get(page) ?? [];
  await testInfo.attach('browser-errors', { body: JSON.stringify(errors, null, 2), contentType: 'application/json' });
  expect(errors, 'No browser runtime or React console errors').toEqual([]);
});

async function openFirstPhoto(page: Page) {
  await page.goto('/');
  const tile = page.locator('#gallery').getByRole('button', { name: /Enlarge photo:/ }).first();
  await tile.scrollIntoViewIfNeeded();
  await expect(page.locator('[data-mobile-actions]')).toBeVisible();
  await tile.tap();
  const dialog = page.getByRole('dialog', { name: 'Enlarged restaurant photos' });
  await expect(dialog).toBeVisible();
  const image = dialog.getByRole('img');
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  return { tile, dialog, image };
}

test('390px gallery stays in two columns and opens an accessible fullscreen lightbox', async ({ page }, testInfo) => {
  const { tile, dialog } = await openFirstPhoto(page);
  const grid = page.locator('#gallery [class*="galleryGrid"]');
  const columns = await grid.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length);
  expect(columns).toBe(2);

  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeCloseTo(0, 0);
  expect(box!.y).toBeCloseTo(0, 0);
  expect(box!.width).toBeCloseTo(390, 0);
  expect(box!.height).toBeCloseTo(844, 0);
  for (const button of await dialog.getByRole('button').all()) {
    const bounds = await button.boundingBox();
    expect(bounds!.width).toBeGreaterThanOrEqual(48);
    expect(bounds!.height).toBeGreaterThanOrEqual(48);
  }
  await expect(page.locator('[data-mobile-actions]')).toHaveJSProperty('hidden', true);
  const screenshot = testInfo.outputPath('gallery-390-fullscreen.png');
  await page.screenshot({ path: screenshot, caret: 'initial' });
  await testInfo.attach('gallery-390-fullscreen', { path: screenshot, contentType: 'image/png' });
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(tile).toBeFocused();
  await expect(page.locator('[data-mobile-actions]')).toBeVisible();
  await expect(page.locator('html')).not.toHaveAttribute('data-gallery-open');
});

test('real touch swipes change photos and an inward two-finger pinch closes the lightbox', async ({ page }) => {
  const { dialog, image } = await openFirstPhoto(page);
  const cdp = await page.context().newCDPSession(page);
  const box = (await image.boundingBox())!;
  const y = box.y + box.height * .5;
  const left = box.x + box.width * .2;
  const right = box.x + box.width * .8;
  const middle = box.x + box.width * .5;

  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ id: 1, x: right, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ id: 1, x: middle, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ id: 1, x: left, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(dialog.getByText('02 / 08', { exact: true })).toBeVisible();
  await expect(image).toHaveAttribute('alt', 'Hands bringing two lattes and a black coffee together');

  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ id: 1, x: left, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ id: 1, x: right, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(dialog.getByText('01 / 08', { exact: true })).toBeVisible();

  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ id: 1, x: left, y }, { id: 2, x: right, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ id: 1, x: middle - 25, y }, { id: 2, x: middle + 25, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('[data-mobile-actions]')).toBeVisible();
  await cdp.detach();
});

for (const device of [
  { name: 'a weak phone on a slow connection', cores: 2, memory: 2, effectiveType: '3g', downlink: .5 },
  { name: 'a powerful phone on a fast connection', cores: 12, memory: 12, effectiveType: '4g', downlink: 20 },
]) test(`${device.name} shows real local-food photos without 3D downloads`, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.addInitScript(profile => {
    Object.defineProperty(navigator, 'hardwareConcurrency', { configurable: true, value: profile.cores });
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, value: profile.memory });
    const connection = new EventTarget();
    Object.assign(connection, { effectiveType: profile.effectiveType, downlink: profile.downlink, saveData: false });
    Object.defineProperty(navigator, 'connection', { configurable: true, value: connection });
    const observedWindow = window as Window & { __webglCalls?: number };
    observedWindow.__webglCalls = 0;
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) {
      if (String(args[0]).startsWith('webgl')) observedWindow.__webglCalls = (observedWindow.__webglCalls || 0) + 1;
      return original.apply(this, args);
    } as typeof original;
  }, device);
  const canvasDownloads: string[] = [];
  page.on('request', request => { if (/CanvasScene|react-three|three_module/.test(request.url())) canvasDownloads.push(request.url()); });
  await page.goto('/', { waitUntil: 'networkidle' });
  const food = page.locator('#signatures');
  await food.scrollIntoViewIfNeeded();
  await expect(food.getByRole('heading', { name: 'Pass the injera.', exact: true })).toBeVisible();
  await expect(food.getByRole('heading', { name: 'Beef Tibs', exact: true })).toBeVisible();
  await expect(food.getByText('680 ETB', { exact: true })).toBeVisible();
  await expect(food.getByRole('heading', { name: 'Yetsom Beyaynetu', exact: true })).toHaveCount(1);
  await expect(food.getByRole('heading', { name: 'Jebena Buna', exact: true })).toHaveCount(1);
  await expect(food.getByRole('region', { name: /Signature dishes/ })).toHaveCSS('scroll-snap-type', 'x mandatory');
  const photos = food.getByRole('img');
  await expect(photos).toHaveCount(6);
  for (const photo of await photos.all()) {
    await expect(photo).toHaveAttribute('src', /\/_next\/image\?.*url=%2Fimages%2Fmenu%2F/);
    await expect(photo).toHaveAttribute('sizes', /max-width: 600px/);
    expect((await photo.getAttribute('alt'))?.length).toBeGreaterThan(12);
  }
  await expect.poll(() => photos.first().evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /Five dishes|in 3D/ })).toHaveCount(0);
  expect(await page.evaluate(() => (window as Window & { __webglCalls?: number }).__webglCalls)).toBe(0);
  expect(canvasDownloads).toEqual([]);
});
