import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

let browserProblems: string[] = [];

test.beforeEach(async ({ page }) => {
  browserProblems = [];
  page.on('console', message => { if (['warning', 'error'].includes(message.type())) browserProblems.push(`${message.type()}: ${message.text()}`); });
  page.on('pageerror', error => browserProblems.push(`pageerror: ${error.message}`));
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test.afterEach(async ({}, testInfo) => {
  if (browserProblems.length) await testInfo.attach('browser-warnings-and-errors', { body: browserProblems.join('\n'), contentType: 'text/plain' });
  expect(browserProblems, 'The page should not log browser warnings or errors').toEqual([]);
});

test('phone menu tabs stay reachable and filter the compact menu without page overflow', async ({ page }) => {
  const menu = page.locator('#menu');
  const tabs = page.locator('[aria-label="Filter dishes by category"]');
  await page.getByRole('navigation', { name: 'Quick actions' }).getByRole('link', { name: 'Menu', exact: true }).click();
  await expect(page).toHaveURL(/#menu$/);
  await expect(menu.locator('article')).toHaveCount(36);
  await expect(menu.getByRole('group')).toHaveCount(9);
  for (const group of await menu.getByRole('group').all()) await expect(group.locator('article')).toHaveCount(4);
  // Owner's menu prices include handwritten corrections to the printed amounts.
  for (const [name, price] of [['Vegetable Wrap', '250 ETB'], ['Scrambled Eggs', '190 ETB'], ['Beef Pizza', '420 ETB'], ['Margherita Pizza', '400 ETB']]) {
    await expect(menu.locator('article').filter({ has: page.getByRole('heading', { name, exact: true }) }).getByText(price, { exact: true })).toHaveCount(1);
  }
  await expect.poll(() => tabs.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
  await page.evaluate(() => window.scrollBy(0, 500));
  await expect.poll(() => tabs.evaluate(element => Math.round(element.getBoundingClientRect().top))).toBe(64);
  await tabs.evaluate(element => { element.scrollLeft = element.scrollWidth; });
  await tabs.getByRole('button', { name: 'Pizza', exact: true }).click();
  await expect(tabs.getByRole('button', { name: 'Pizza', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(menu.locator('article')).toHaveCount(4);
  await expect(menu.getByRole('heading', { name: 'Beef Pizza', exact: true })).toBeVisible();
  await menu.getByRole('combobox', { name: 'Filter by diet' }).selectOption('vegetarian');
  await expect(menu.locator('article')).toHaveCount(2);
  await expect(menu.getByRole('heading', { name: 'Margherita Pizza', exact: true })).toBeVisible();
  await expect.poll(() => tabs.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
  await tabs.getByRole('button', { name: 'Fasting Dishes', exact: true }).click();
  await menu.getByRole('combobox', { name: 'Filter by diet' }).selectOption('fasting');
  await expect(menu.locator('article')).toHaveCount(4);
  await expect(menu.getByRole('heading', { name: 'Beyaynetu', exact: true })).toBeVisible();
  await expect(menu.getByRole('heading', { name: 'Shiro', exact: true })).toBeVisible();
  await expect(menu.getByRole('heading', { name: 'Tibs', exact: true })).toHaveCount(0);
  // The combined filters must exclude meat dishes from the fasting selection.
  await tabs.getByRole('button', { name: 'Non-fasting', exact: true }).click();
  await expect(menu.locator('article')).toHaveCount(0);
  await expect(menu.getByText('No dishes match. Choose another category.', { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('menu favorites sync with signature dishes and survive a page reload', async ({ page }) => {
  const menu = page.locator('#menu');
  const signature = page.locator('#signatures');
  const save = 'Save Tibs to favorites';
  const remove = 'Remove Tibs from favorites';
  await menu.getByRole('button', { name: save, exact: true }).click();
  await expect(menu.getByRole('button', { name: remove, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(signature.getByRole('button', { name: remove, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.reload({ waitUntil: 'networkidle' });
  await expect(menu.getByRole('button', { name: remove, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(signature.getByRole('button', { name: remove, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await signature.getByRole('button', { name: remove, exact: true }).click();
  await expect(menu.getByRole('button', { name: save, exact: true })).toHaveAttribute('aria-pressed', 'false');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('miklol-favorites') || '[]').includes('lamb-tibs'))).toBe(false);
});

test('phone table planner validates five fields and offers a real call to confirm', async ({ page }) => {
  const form = page.locator('[data-reservation-form]');
  await expect(form.locator('input, select')).toHaveCount(5);
  expect(await form.locator('input, select').evaluateAll(elements => elements.map(element => element.getAttribute('name')))).toEqual(['date', 'time', 'guests', 'name', 'phone']);
  await expect(form.getByLabel('Date', { exact: true })).toHaveAttribute('type', 'date');
  await expect(form.getByLabel('Guests', { exact: true })).toHaveAttribute('inputmode', 'numeric');
  await expect(form.getByLabel('Phone', { exact: true })).toHaveAttribute('type', 'tel');
  await expect(form.getByLabel('Phone', { exact: true })).toHaveAttribute('autocomplete', 'tel');
  await form.getByRole('button', { name: 'Preview my table', exact: true }).click();
  await expect(form.getByLabel('Date', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByLabel('Name', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByLabel('Phone', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByText('Choose a date for your visit.', { exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Quick actions' })).toBeHidden();

  const futureDate = new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10);
  await form.getByLabel('Date', { exact: true }).fill(futureDate);
  await form.getByLabel('Time (Addis Ababa)', { exact: true }).selectOption('18:30');
  await form.getByLabel('Guests', { exact: true }).fill('4');
  await form.getByLabel('Name', { exact: true }).fill('Phone Test');
  await form.getByLabel('Phone', { exact: true }).fill('invalid');
  await form.getByRole('button', { name: 'Preview my table', exact: true }).click();
  await expect(form.getByLabel('Phone', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(form.getByText('Use a valid 09… or 07… number, or include a country code.', { exact: true })).toBeVisible();
  await form.getByLabel('Phone', { exact: true }).fill('0912345678');
  await form.getByRole('button', { name: 'Preview my table', exact: true }).click();
  const reservation = page.locator('#reservation');
  await expect(reservation.getByRole('heading', { name: 'Your table plan is ready.' })).toBeVisible();
  await expect(reservation.getByText(/Phone, your preview is for 4 on/)).toBeVisible();
  await expect(reservation.getByText('No table is booked yet. Call us to confirm your date and time.', { exact: true })).toBeVisible();
  await expect(reservation.getByRole('link', { name: 'Call to confirm', exact: true })).toHaveAttribute('href', 'tel:+251921282925');
  await reservation.getByRole('button', { name: 'Change my table plan', exact: true }).click();
  await expect(form.getByLabel('Date', { exact: true })).toHaveValue(futureDate);
  await expect(form.getByLabel('Phone', { exact: true })).toHaveValue('0912345678');
});
