import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Accessibility Menu', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    // Use /swiper page which has the Navbar (Landing page doesn't use Layout)
    await page.goto(`${BASE_URL}/swiper`);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('accessibility button is visible in navbar', async ({ page }) => {
    const accessibilityButton = page.locator('button[aria-label="Accessibility settings"]');
    await expect(accessibilityButton.first()).toBeVisible();
    console.log('Accessibility button found in navbar');
  });

  test('clicking accessibility button opens the menu', async ({ page }) => {
    const accessibilityButton = page.locator('button[aria-label="Accessibility settings"]').first();
    await accessibilityButton.click();

    // Check for modal with accessibility settings
    const modal = page.locator('text="Accessibility Settings"');
    await expect(modal).toBeVisible({ timeout: 5000 });
    console.log('Accessibility menu opened successfully');
  });

  test('can change font size to large', async ({ page }) => {
    // Open accessibility menu
    const accessibilityButton = page.locator('button[aria-label="Accessibility settings"]').first();
    await accessibilityButton.click();
    await page.waitForTimeout(300);

    // Click A+ button for large font
    const largeFontButton = page.locator('button:has-text("A+")');
    await largeFontButton.click();
    await page.waitForTimeout(300);

    // Verify HTML class changed
    const html = page.locator('html');
    const className = await html.getAttribute('class');
    console.log('HTML class after A+ click:', className);
    expect(className).toContain('font-large');

    // Verify localStorage
    const storedValue = await page.evaluate(() => localStorage.getItem('fontSize'));
    expect(storedValue).toBe('large');
  });

  test('can change font size to small', async ({ page }) => {
    // Open accessibility menu
    const accessibilityButton = page.locator('button[aria-label="Accessibility settings"]').first();
    await accessibilityButton.click();
    await page.waitForTimeout(300);

    // Click A- button for small font
    const smallFontButton = page.locator('button:has-text("A-")');
    await smallFontButton.click();
    await page.waitForTimeout(300);

    // Verify HTML class changed
    const html = page.locator('html');
    const className = await html.getAttribute('class');
    console.log('HTML class after A- click:', className);
    expect(className).toContain('font-small');
  });

  test('can enable high contrast mode', async ({ page }) => {
    // Open accessibility menu
    const accessibilityButton = page.locator('button[aria-label="Accessibility settings"]').first();
    await accessibilityButton.click();
    await page.waitForTimeout(500);

    // Click High Contrast button (use exact match to avoid clicking "Normal" which also contains text)
    const highContrastButton = page.getByRole('button', { name: 'High Contrast', exact: true });
    await highContrastButton.click();
    await page.waitForTimeout(500);

    // Verify HTML class changed
    const html = page.locator('html');
    const className = await html.getAttribute('class');
    console.log('HTML class after High Contrast click:', className);
    expect(className).toContain('contrast-high');

    // Verify localStorage
    const storedValue = await page.evaluate(() => localStorage.getItem('contrast'));
    expect(storedValue).toBe('high');
  });

  test('can close accessibility menu', async ({ page }) => {
    // Open accessibility menu
    const accessibilityButton = page.locator('button[aria-label="Accessibility settings"]').first();
    await accessibilityButton.click();
    await page.waitForTimeout(300);

    // Verify modal is open
    const modal = page.locator('text="Accessibility Settings"');
    await expect(modal).toBeVisible();

    // Close with Escape key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Verify modal is closed
    await expect(modal).not.toBeVisible();
    console.log('Accessibility menu closed successfully');
  });

  test('settings persist after page reload', async ({ page }) => {
    // Open accessibility menu and set large font + high contrast
    const accessibilityButton = page.locator('button[aria-label="Accessibility settings"]').first();
    await accessibilityButton.click();
    await page.waitForTimeout(300);

    await page.locator('button:has-text("A+")').click();
    await page.waitForTimeout(200);
    await page.locator('button:has-text("High Contrast")').click();
    await page.waitForTimeout(200);

    // Close menu and reload
    await page.keyboard.press('Escape');
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify settings persisted
    const html = page.locator('html');
    const className = await html.getAttribute('class');
    console.log('HTML class after reload:', className);
    expect(className).toContain('font-large');
    expect(className).toContain('contrast-high');
  });

  test('take screenshot of accessibility menu', async ({ page }) => {
    // Open accessibility menu
    const accessibilityButton = page.locator('button[aria-label="Accessibility settings"]').first();
    await accessibilityButton.click();
    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'test-results/screenshots/accessibility-menu.png',
      fullPage: false
    });
    console.log('Accessibility menu screenshot saved');
  });
});
