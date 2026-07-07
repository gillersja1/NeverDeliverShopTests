import { test, expect } from '@playwright/test';

/**
 * Catalog/listing page checks.
 *
 * A couple of things that would need real filtering/sorting BEHAVIOR to
 * verify - e.g. does clicking "Beauty" actually filter results? does
 * "Sort by" reorder them? - couldn't be confirmed from a static
 * screenshot, so they're left as test.fixme() below rather than asserted
 * on a guess. Un-skip and fill these in once you've confirmed the real
 * behavior, e.g. by running:
 *
 *   npm run codegen
 *
 * which opens Playwright's codegen recorder against the live site and
 * generates real locators/assertions as you click around.
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

  test.fixme('selecting a category filter pill updates the result count', async ({ page }) => {
    // Ambiguous without inspecting the DOM: "Beauty" appears in both the
    // top category nav bar and the filter pill row below the hero, so a
    // plain text locator here would hit Playwright's strict-mode
    // duplicate-match error. Scope this to the pill row's actual
    // container once you've confirmed its selector via codegen or
    // browser devtools.
  });

  test.fixme('cart icon reflects items added to cart', async ({ page }) => {
    // Not verifiable from a screenshot: need to confirm whether product
    // cards expose an "Add to cart" action at all, and what the cart
    // badge/counter looks like once populated.
  });
});
