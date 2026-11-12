import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const [width, height] of [[360, 800], [390, 844], [430, 932], [768, 1024], [1024, 768]]) {
  test(`layout and reachability at ${width}px`, async ({ browser }, testInfo) => {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width <= 600, isMobile: width <= 600, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text()); });
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (width <= 600) {
      const header = await page.locator('header').boundingBox();
      expect(header?.height).toBeGreaterThanOrEqual(56);
      expect(header?.height).toBeLessThanOrEqual(64);
      const hero = await page.locator('#top').boundingBox();
      expect(hero?.height).toBeLessThanOrEqual(height);
      const title = await page.locator('#hero-title').evaluate(element => {
        const style = getComputedStyle(element);
        return { font: parseFloat(style.fontSize), lines: element.getBoundingClientRect().height / parseFloat(style.lineHeight) };
      });
      expect(title.font).toBeGreaterThanOrEqual(36);
      expect(title.font).toBeLessThanOrEqual(44);
      expect(title.lines).toBeLessThanOrEqual(3.05);
      const images = await page.locator('#top img').evaluateAll(elements => elements.filter(element => element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0).length);
      expect(images).toBeLessThanOrEqual(2);
      const actions = page.getByRole('navigation', { name: 'Quick actions' });
      await expect(actions).toBeVisible();
      await expect(actions.getByRole('link', { name: 'Reserve', exact: true })).toHaveAttribute('href', '#reservation');
      await expect(actions.getByRole('link', { name: /Call MIKLOL/ })).toHaveAttribute('href', 'tel:+251921282925');
      // A real visitor interaction ends first-paint tracking before testing later sections.
      await page.getByRole('button', { name: 'Open menu', exact: true }).tap();
      await page.getByRole('button', { name: 'Close menu', exact: true }).tap();
      await page.locator('#visit').scrollIntoViewIfNeeded();
      await expect(page.locator('#visit').getByRole('link', { name: '+251 92 128 2925', exact: true })).toBeVisible();
      await expect(page.locator('#visit').getByRole('link', { name: 'erminati085@gmail.com', exact: true })).toHaveAttribute('href', 'mailto:erminati085@gmail.com');
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: testInfo.outputPath(`${width}px.png`), fullPage: true, caret: 'initial' });
    expect(errors).toEqual([]);
    await context.close();
  });
}

test('phone accessibility has no WCAG A/AA violations', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/', { waitUntil: 'networkidle' });
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(result.violations.map(item => ({ id: item.id, impact: item.impact, elements: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }))).toEqual([]);
  await page.getByRole('button', { name: 'Open menu', exact: true }).tap();
  const menuResult = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(menuResult.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
  await page.getByRole('button', { name: 'Close menu', exact: true }).tap();
  await page.locator('#gallery button').first().tap();
  const galleryResult = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(galleryResult.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
  await context.close();
});

test('signature dishes and review cards support phone swipes', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/', { waitUntil: 'networkidle' });
  const cdp = await context.newCDPSession(page);
  const dishes = page.getByRole('region', { name: /Signature dishes/ });
  await dishes.scrollIntoViewIfNeeded();
  const dishBox = await dishes.boundingBox();
  if (!dishBox) throw new Error('Signature carousel is missing');
  const dishY = dishBox.y + 100;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 310, y: dishY }] });
  for (const x of [250, 180, 90]) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: dishY }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => dishes.evaluate(element => element.scrollLeft)).toBeGreaterThan(100);
  const reviews = page.getByRole('button', { name: 'Show menu suggestion 1' });
  await reviews.scrollIntoViewIfNeeded();
  const card = reviews.locator('..').locator('..');
  const box = await card.boundingBox();
  if (!box) throw new Error('Review card is missing');
  const y = box.y + 100;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 300, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 120, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(page.getByRole('button', { name: 'Show menu suggestion 2' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Show menu suggestion 3' }).tap();
  await expect(page.getByRole('button', { name: 'Show menu suggestion 3' })).toHaveAttribute('aria-pressed', 'true');
  await context.close();
});
