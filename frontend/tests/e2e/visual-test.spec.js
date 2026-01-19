import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Visual Feature Tests', () => {
  test('take screenshot of landing page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'test-results/screenshots/landing-page.png',
      fullPage: true
    });

    console.log('Landing page screenshot saved');
  });

  test('take screenshot of swiper page', async ({ page }) => {
    await page.goto(`${BASE_URL}/swiper`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: 'test-results/screenshots/swiper-page.png',
      fullPage: true
    });

    console.log('Swiper page screenshot saved');

    // Also log what we see
    const title = await page.locator('h1').first().textContent();
    console.log('Page title:', title);

    const buttons = await page.locator('button').count();
    console.log('Total buttons:', buttons);
  });

  test('take screenshot of swiper with high contrast', async ({ page }) => {
    await page.goto(`${BASE_URL}/swiper`);
    await page.waitForLoadState('networkidle');

    // Set high contrast mode
    await page.evaluate(() => {
      localStorage.setItem('contrast', 'high');
      document.documentElement.classList.add('contrast-high');
    });

    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'test-results/screenshots/swiper-high-contrast.png',
      fullPage: true
    });

    console.log('High contrast swiper screenshot saved');
  });

  test('take screenshot of swiper with large font', async ({ page }) => {
    await page.goto(`${BASE_URL}/swiper`);
    await page.waitForLoadState('networkidle');

    // Set large font
    await page.evaluate(() => {
      localStorage.setItem('fontSize', 'large');
      document.documentElement.classList.add('font-large');
    });

    await page.waitForTimeout(500);

    await page.screenshot({
      path: 'test-results/screenshots/swiper-large-font.png',
      fullPage: true
    });

    console.log('Large font swiper screenshot saved');
  });

  test('verify swiper cards are interactive', async ({ page }) => {
    await page.goto(`${BASE_URL}/swiper`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check if the swiper container exists
    const swiperContainer = page.locator('.max-w-md');
    const containerExists = await swiperContainer.count() > 0;
    console.log('Swiper container exists:', containerExists);

    if (containerExists) {
      // Check for card stack
      const cardStack = page.locator('.relative.h-\\[480px\\]');
      const cardStackExists = await cardStack.count() > 0;
      console.log('Card stack exists:', cardStackExists);

      // Check for swipe buttons (likely in a flex container below cards)
      const buttonContainer = page.locator('.flex.justify-center.gap-8');
      const buttonsExist = await buttonContainer.count() > 0;
      console.log('Button container exists:', buttonsExist);

      // Get all buttons in the swipe buttons area
      if (buttonsExist) {
        const buttons = buttonContainer.locator('button');
        const buttonCount = await buttons.count();
        console.log('Swipe buttons count:', buttonCount);
      }
    }

    await page.screenshot({
      path: 'test-results/screenshots/swiper-debug.png',
      fullPage: true
    });
  });

  test('verify activities page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/activities`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: 'test-results/screenshots/activities-page.png',
      fullPage: true
    });

    const activities = page.locator('[class*="card"]');
    const activityCount = await activities.count();
    console.log('Activity cards found:', activityCount);
  });

  test('verify authentication page', async ({ page }) => {
    await page.goto(`${BASE_URL}/auth`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'test-results/screenshots/auth-page.png',
      fullPage: true
    });

    const form = page.locator('form');
    const formExists = await form.count() > 0;
    console.log('Auth form exists:', formExists);
  });
});
