import { test, expect } from '@playwright/test';

/**
 * Smoke tests for the NeverDeliver homepage - a satirical e-commerce demo
 * ("Big catalog energy, zero delivery anxiety.").
 *
 * These locators are based on a screenshot of the live site rather than
 * inspected DOM/test-ids, so they lean on visible text and ARIA roles
 * (Playwright's own recommended approach when you don't control the
 * markup). If the site has - or you add - data-testid attributes, prefer
 * those instead; they're far less brittle than text matching.
 */

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with the expected hero content', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Welcome to NeverDeliver/i })).toBeVisible();
    await expect(page.getByText('Big catalog energy, zero delivery anxiety.')).toBeVisible();
    await expect(page.getByText('FREE delivery on every imaginary order')).toBeVisible();
  });

  test('shows the flash sale banner with a live countdown', async ({ page }) => {
    await expect(page.getByText('FLASH SALE')).toBeVisible();
    await expect(page.getByText('50% OFF everything')).toBeVisible();

    const timer = page.getByText(/^\d{2}:\d{2}:\d{2}$/);
    await expect(timer).toBeVisible();

    const firstReading = await timer.textContent();
    await page.waitForTimeout(1500);
    const secondReading = await timer.textContent();

    // A real countdown should be ticking down, not static.
    expect(secondReading).not.toEqual(firstReading);
  });

  test('search box is present and accepts input', async ({ page }) => {
    const searchBox = page.getByPlaceholder('Search products...');
    await expect(searchBox).toBeVisible();

    await searchBox.fill('phone');
    await expect(searchBox).toHaveValue('phone');
  });

  test('region, currency, and language selectors are visible', async ({ page }) => {
    await expect(page.getByText('UK', { exact: true })).toBeVisible();
    await expect(page.getByText('GBP', { exact: true })).toBeVisible();
    await expect(page.getByText('EN', { exact: true })).toBeVisible();
  });
});
