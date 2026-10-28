const { test, expect } = require('@playwright/test');

/**
 * Catalog/listing page checks.
 *
 * Category names appear twice on the page - once in the header nav and
 * once as a filter pill in the main content - so filter locators are
 * scoped to #main-content to avoid Playwright strict-mode duplicate
 * matches.
 */

test.describe('Catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows a result count and pagination summary', async ({ page }) => {
    await expect(page.getByText(/\d+ results · Page \d+ of \d+/)).toBeVisible();
  });

  test('sort and per-page controls are visible', async ({ page }) => {
    await expect(page.getByText('Sort by')).toBeVisible();
    await expect(page.getByText('Per page')).toBeVisible();
  });

  test('product cards show pricing/delivery badges', async ({ page }) => {
    await expect(page.getByText('Plus FREE delivery').first()).toBeVisible();
    await expect(page.getByText(/-\d+%/).first()).toBeVisible();
  });

  test('selecting a category filter pill narrows the results', async ({ page }) => {
    const resultCount = page.getByText(/\d+ results · Page \d+ of \d+/);
    const readTotal = async () => parseInt((await resultCount.textContent()) ?? '', 10);

    await expect(resultCount).toBeVisible();
    const totalBefore = await readTotal();

    await page.locator('#main-content').getByRole('link', { name: 'beauty', exact: true }).click();

    await expect(page).toHaveURL(/[?&]category=beauty/);
    await expect.poll(readTotal).toBeLessThan(totalBefore);
    expect(await readTotal()).toBeGreaterThan(0);
  });

  test('adding items updates the cart count', async ({ page }) => {
    // The cart drawer's heading is rendered at every viewport, so it's a
    // more reliable count than the header icon (see the a11y test below).
    const cartHeading = page.getByRole('heading', { name: /Shopping Cart \(\d+\)/ });
    const addButtons = page.locator('#main-content').getByRole('button', { name: 'Add to Cart' });

    await expect(cartHeading).toHaveText('Shopping Cart (0)');

    await addButtons.nth(0).click();
    await expect(cartHeading).toHaveText('Shopping Cart (1)');

    await addButtons.nth(1).click();
    await expect(cartHeading).toHaveText('Shopping Cart (2)');
  });

  test('header cart button has an accessible name', async ({ page }, testInfo) => {
    // Known defect: below the md breakpoint the cart button is icon-only
    // with no aria-label, so screen readers announce just "button"
    // (WCAG 4.1.2 Name, Role, Value). Marked as an expected failure on
    // mobile so the suite stays green but flags it the moment it's fixed.
    test.fail(testInfo.project.name === 'Mobile Chrome', 'Cart button has no accessible name on mobile viewports');

    await expect(page.getByRole('banner').getByRole('button', { name: /cart/i })).toBeVisible();
  });
});
