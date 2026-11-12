import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`kitchen layout and photo integrity at ${width}px`, async ({ browser }, testInfo) => {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, hasTouch: width <= 600, isMobile: width <= 600, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    const section = page.locator('#kitchen-team');
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole('heading', { name: 'Meet our kitchen team.' })).toBeVisible();
    await expect(section.getByRole('img', { name: /Photo placeholder:/ })).toHaveCount(6);
    await expect(page.locator('img[src*="people%2Fchef"], img[src*="people/chef"]')).toHaveCount(0);
    const track = page.locator('#kitchen-team-photos');
    const layout = await track.evaluate(element => {
      const cards = Array.from(element.children).map(card => {
        const box = card.getBoundingClientRect();
        const media = card.firstElementChild!.getBoundingClientRect();
        const caption = card.lastElementChild!.getBoundingClientRect();
        return { x: Math.round(box.x), y: Math.round(box.y), width: box.width, mediaBottom: media.bottom, captionTop: caption.top };
      });
      return { cards, snap: getComputedStyle(element).scrollSnapType, pageWidth: document.documentElement.scrollWidth, overflow: element.scrollWidth > element.clientWidth };
    });
    expect(layout.pageWidth).toBeLessThanOrEqual(width);
    expect(layout.cards.every(card => card.captionTop >= card.mediaBottom - 1)).toBe(true);
    if (width <= 600) {
      expect(layout.snap).toBe('x mandatory');
      expect(layout.overflow).toBe(true);
      const last = section.getByRole('button', { name: /Show kitchen photo 6:/ });
      await last.click();
      await expect(last).toHaveAttribute('aria-pressed', 'true');
      await track.press('Home');
      await expect(section.getByRole('button', { name: /Show kitchen photo 1:/ })).toHaveAttribute('aria-pressed', 'true');
      await track.press('ArrowRight');
      await expect(section.getByRole('button', { name: /Show kitchen photo 2:/ })).toHaveAttribute('aria-pressed', 'true');
      await track.press('Home');
    } else {
      expect(layout.overflow).toBe(false);
      const columns = width <= 900 ? 2 : 3;
      expect(new Set(layout.cards.map(card => card.y)).size).toBe(6 / columns);
      expect(new Set(layout.cards.map(card => card.x)).size).toBe(columns);
    }
    await section.screenshot({ path: testInfo.outputPath(`kitchen-${width}.png`) });
    expect(errors).toEqual([]);
    await context.close();
  });
}

test('native phone swipe updates the active dot and the last slot is reachable', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  const track = page.locator('#kitchen-team-photos');
  await track.scrollIntoViewIfNeeded();
  const box = await track.boundingBox();
  if (!box) throw new Error('Kitchen carousel is missing');
  const cdp = await context.newCDPSession(page);
  const y = box.y + 100;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 315, y }] });
  for (const x of [270, 200, 135, 65]) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => track.evaluate(element => element.scrollLeft)).toBeGreaterThan(100);
  await expect(page.getByRole('button', { name: /Show kitchen photo 1:/ })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: /Show kitchen photo 6:/ }).tap();
  await expect(page.getByRole('button', { name: /Show kitchen photo 6:/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#kitchen-team').getByText('Photo 6 of 6', { exact: true })).toHaveText('Photo 6 of 6');
  await context.close();
});

test('kitchen section is accessible and honours reduced motion', async ({ page }) => {
  await page.goto('/');
  await page.locator('#kitchen-team').scrollIntoViewIfNeeded();
  const result = await new AxeBuilder({ page }).include('#kitchen-team').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
  await expect(page.locator('#kitchen-team-photos > figure').first()).toHaveCSS('opacity', '1');
  const duration = await page.locator('#kitchen-team-photos > figure').first().evaluate(element => parseFloat(getComputedStyle(element).transitionDuration));
  // The existing global reduced-motion rule uses .01ms rather than exact zero.
  expect(duration).toBeLessThanOrEqual(.001);
});

test('cards reveal only once as they enter view', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.goto('/');
  const card = page.locator('#kitchen-team-photos > figure').first();
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-revealed', 'true');
  await expect(card).toHaveCSS('opacity', '1');
  await page.locator('#top').scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute('data-revealed', 'true');
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveCSS('opacity', '1');
  await context.close();
});
