import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
];

async function settleLayout(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
}

async function storyGeometry(page: Page) {
  return page.locator('#story').evaluate(section => {
    const grid = section.firstElementChild!;
    const copy = grid.firstElementChild!;
    const figure = section.querySelector('figure')!;
    const photo = figure.querySelector('img')!.parentElement!;
    const rect = (element: Element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom };
    };
    return {
      section: rect(section),
      copy: rect(copy),
      figure: rect(figure),
      photo: rect(photo),
      scrollY: window.scrollY,
      stickyTop: parseFloat(getComputedStyle(figure).top),
      position: getComputedStyle(figure).position,
      background: getComputedStyle(section).backgroundColor,
      backgroundImage: getComputedStyle(section).backgroundImage,
    };
  });
}

for (const { width, height } of viewports) {
  test(`local menu and kitchen layout at ${width}px`, async ({ browser }, testInfo) => {
    const context = await browser.newContext({
      baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
      viewport: { width, height },
      hasTouch: width <= 600,
      isMobile: width <= 600,
      deviceScaleFactor: 1,
      // Exercise optional desktop GSAP/Lenis loading at the largest width.
      reducedMotion: width === 1440 ? 'no-preference' : 'reduce',
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

    try {
      await page.goto('/', { waitUntil: 'networkidle' });
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      expect(await page.locator('main section, footer').evaluateAll(elements => elements
        .filter(element => parseFloat(getComputedStyle(element).scrollMarginTop) <= 0)
        .map(element => element.id || element.tagName))).toEqual([]);

      const story = page.locator('#story');
      await story.scrollIntoViewIfNeeded();
      await expect(story.getByRole('heading', { level: 2 })).toBeVisible();
      await expect.poll(() => story.locator('figure img').evaluate(image => {
        const photo = image as HTMLImageElement;
        return photo.complete && photo.naturalWidth > 0;
      })).toBe(true);
      await story.evaluate(section => section.scrollIntoView({ block: 'start', behavior: 'instant' }));
      await settleLayout(page);

      const initial = await storyGeometry(page);
      expect(initial.background).not.toBe('rgba(0, 0, 0, 0)');
      expect(initial.backgroundImage).toBe('none');

      if (width >= 1024) {
        expect(Math.abs(initial.copy.y - initial.figure.y), 'Text and image share the same top line').toBeLessThanOrEqual(2);
        expect(initial.figure.x - initial.copy.right, 'Text never overlaps the photo column').toBeGreaterThanOrEqual(32);
        expect(initial.position).toBe('sticky');
      } else {
        expect(initial.figure.y - initial.copy.bottom, 'Photo follows the complete text block').toBeGreaterThanOrEqual(28);
        if (width <= 600) expect(initial.photo.width / initial.photo.height, 'Phone photo keeps its 4:5 ratio').toBeCloseTo(0.8, 2);
      }

      await mkdir(path.resolve('reports'), { recursive: true });
      await page.screenshot({ path: path.resolve(`reports/local-layout-${width}.png`), caret: 'initial' });
      if (width <= 600) {
        await story.locator('figure').scrollIntoViewIfNeeded();
        await settleLayout(page);
        await page.screenshot({ path: path.resolve(`reports/local-layout-${width}-photo.png`), caret: 'initial' });
      } else if (width >= 1024) {
        // Advance beyond the figure's natural top to exercise real CSS sticking.
        const target = initial.figure.y + initial.scrollY - initial.stickyTop + 72;
        await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), target);
        await expect.poll(async () => Math.abs((await storyGeometry(page)).figure.y - initial.stickyTop), {
          message: 'The desktop image sticks below the header',
        }).toBeLessThanOrEqual(2);
        const sticky = await storyGeometry(page);
        expect(sticky.figure.bottom).toBeLessThanOrEqual(sticky.section.bottom + 1);
        await page.screenshot({ path: path.resolve(`reports/local-layout-${width}-sticky.png`), caret: 'initial' });
      }

      const occasions = page.locator('#story + section');
      await occasions.getByRole('heading', { level: 2 }).scrollIntoViewIfNeeded();
      await settleLayout(page);
      const ending = await storyGeometry(page);
      const next = await occasions.boundingBox();
      expect(next).not.toBeNull();
      expect(ending.figure.bottom, 'Kitchen photo cannot extend into the occasions section').toBeLessThanOrEqual(next!.y + 1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(page.locator('[data-story-image], .pin-spacer')).toHaveCount(0);
      await expect(page.locator('canvas')).toHaveCount(0);
      await page.screenshot({ path: path.resolve(`reports/local-layout-${width}-occasions.png`), caret: 'initial' });
      await testInfo.attach('kitchen-layout-geometry', { body: JSON.stringify({ width, initial, ending, occasions: next }, null, 2), contentType: 'application/json' });
      expect(errors, 'No browser or React errors').toEqual([]);
    } finally {
      await context.close();
    }
  });
}
