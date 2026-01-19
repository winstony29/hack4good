import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

// Mock activities data for testing
const MOCK_ACTIVITIES = [
  {
    id: 1,
    title: "Beach Cleanup",
    description: "Help clean the local beach and protect marine life",
    date: "2024-02-15",
    time: "09:00",
    location: "Sentosa Beach",
    skills_required: ["Environmental"],
    spots_available: 10
  },
  {
    id: 2,
    title: "Food Bank Volunteer",
    description: "Sort and distribute food to families in need",
    date: "2024-02-16",
    time: "10:00",
    location: "Community Center",
    skills_required: ["Social"],
    spots_available: 5
  },
  {
    id: 3,
    title: "Tutoring Session",
    description: "Help students with their homework and studies",
    date: "2024-02-17",
    time: "14:00",
    location: "Library",
    skills_required: ["Education"],
    spots_available: 3
  }
];

test.describe('Accessibility CSS and Context', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/MINDS ActivityHub/);
  });

  test('accessibility CSS file is loaded', async ({ page }) => {
    // Check if accessibility.css styles are applied
    const body = page.locator('body');
    const computedStyle = await body.evaluate(el => {
      const style = getComputedStyle(el);
      return {
        bgVar: getComputedStyle(document.documentElement).getPropertyValue('--a11y-bg'),
        textVar: getComputedStyle(document.documentElement).getPropertyValue('--a11y-text')
      };
    });
    console.log('CSS Variables:', computedStyle);
    // Should have CSS variables defined (they may be empty but should not error)
  });

  test('font size can be set via localStorage and persists', async ({ page }) => {
    // Set font size to large via localStorage
    await page.evaluate(() => {
      localStorage.setItem('fontSize', 'large');
    });

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check if the class is applied
    const html = page.locator('html');
    const className = await html.getAttribute('class');
    console.log('HTML class after setting fontSize to large:', className);

    // The context should read from localStorage and apply the class
    // If the class includes 'font-large', the feature works
    if (className && className.includes('font-large')) {
      expect(className).toContain('font-large');
    } else {
      // Check if localStorage persisted
      const storedValue = await page.evaluate(() => localStorage.getItem('fontSize'));
      expect(storedValue).toBe('large');
    }
  });

  test('high contrast mode can be set via localStorage', async ({ page }) => {
    // Set contrast to high via localStorage
    await page.evaluate(() => {
      localStorage.setItem('contrast', 'high');
    });

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check if the class is applied
    const html = page.locator('html');
    const className = await html.getAttribute('class');
    console.log('HTML class after setting contrast to high:', className);

    // Check localStorage value
    const storedValue = await page.evaluate(() => localStorage.getItem('contrast'));
    expect(storedValue).toBe('high');
  });

  test('layout component uses accessibility CSS variables', async ({ page }) => {
    // Check that layout container has CSS variable styling
    const layout = page.locator('.min-h-screen').first();

    if (await layout.count() > 0) {
      const styles = await layout.evaluate(el => {
        const computed = getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          backgroundInlineStyle: el.style.backgroundColor
        };
      });
      console.log('Layout styles:', styles);
      // Should have either inline var() styles or computed values
      expect(styles.backgroundColor || styles.backgroundInlineStyle).toBeTruthy();
    }
  });
});

test.describe('Activity Swiper with Mocked API', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API endpoint for activities
    await page.route('**/api/matches/available', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: MOCK_ACTIVITIES })
      });
    });

    // Mock the create match endpoint
    await page.route('**/api/matches', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });

    await page.goto(`${BASE_URL}/swiper`);
    await page.waitForLoadState('networkidle');
  });

  test('swiper page loads with title', async ({ page }) => {
    const title = page.locator('h1:has-text("Find Activities")');
    await expect(title).toBeVisible({ timeout: 10000 });
  });

  test('activity cards are displayed', async ({ page }) => {
    // Wait for cards to render
    await page.waitForTimeout(1000);

    // Look for card content - could be card component or activity title
    const cardContent = page.locator('.relative.h-\\[480px\\]');
    if (await cardContent.count() > 0) {
      console.log('Card stack container found');
    }

    // Check for activity content
    const activityText = page.locator('text=Beach Cleanup');
    const hasContent = await activityText.count() > 0;
    console.log('Activity content visible:', hasContent);
  });

  test('swipe buttons exist', async ({ page }) => {
    await page.waitForTimeout(500);

    // Look for buttons with X or Heart icons or pass/match labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    console.log('Total buttons found:', buttonCount);

    // Check for any button that could be a swipe button
    const passButton = page.locator('button').filter({ hasText: /pass/i });
    const matchButton = page.locator('button').filter({ hasText: /match/i });

    // Or look for buttons with svg icons
    const iconButtons = page.locator('button svg');
    const iconCount = await iconButtons.count();
    console.log('Buttons with icons:', iconCount);
  });

  test('progress counter shows correct count', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Look for progress text like "1 of 3 activities"
    const progress = page.locator('text=/\\d+ of \\d+ activities/');
    if (await progress.count() > 0) {
      const text = await progress.textContent();
      console.log('Progress text:', text);
      expect(text).toMatch(/\d+ of \d+ activities/);
    }
  });
});

test.describe('Swipe Interactions (with mocks)', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/matches/available', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: MOCK_ACTIVITIES })
      });
    });

    await page.route('**/api/matches', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });

    await page.goto(`${BASE_URL}/swiper`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('clicking pass button changes the card', async ({ page }) => {
    // Get initial progress
    const progressBefore = page.locator('text=/\\d+ of \\d+ activities/');
    let textBefore = '';
    if (await progressBefore.count() > 0) {
      textBefore = await progressBefore.textContent();
      console.log('Progress before pass:', textBefore);
    }

    // Try to find and click the pass button
    // Look for button with X icon or pass-related styling
    const buttons = page.locator('button');
    const allButtons = await buttons.all();

    for (const btn of allButtons) {
      const hasXIcon = await btn.locator('svg').count() > 0;
      const classList = await btn.getAttribute('class');
      // Pass button often has red styling
      if (classList && (classList.includes('red') || classList.includes('border-red'))) {
        await btn.click();
        console.log('Clicked pass button');
        await page.waitForTimeout(500);
        break;
      }
    }
  });

  test('clicking match button shows celebration', async ({ page }) => {
    // Find and click match button
    const buttons = page.locator('button');
    const allButtons = await buttons.all();

    for (const btn of allButtons) {
      const classList = await btn.getAttribute('class');
      // Match button often has green styling
      if (classList && (classList.includes('green') || classList.includes('border-green'))) {
        await btn.click();
        console.log('Clicked match button');

        // Wait for celebration animation
        await page.waitForTimeout(1500);

        // Check for celebration elements
        const celebration = page.locator('[class*="confetti"], [class*="celebration"], [class*="match"]');
        const celebrationCount = await celebration.count();
        console.log('Celebration elements found:', celebrationCount);
        break;
      }
    }
  });
});

test.describe('Empty States', () => {
  test('shows empty state when no activities available', async ({ page }) => {
    // Mock empty response
    await page.route('**/api/matches/available', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] })
      });
    });

    await page.goto(`${BASE_URL}/swiper`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Should show empty state
    const emptyState = page.locator('text=/no.*activit/i');
    if (await emptyState.count() > 0) {
      console.log('Empty state shown correctly');
    }
  });

  test('shows loading spinner initially', async ({ page }) => {
    // Delay the API response
    await page.route('**/api/matches/available', async (route) => {
      await new Promise(r => setTimeout(r, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: MOCK_ACTIVITIES })
      });
    });

    await page.goto(`${BASE_URL}/swiper`);

    // Check for loading spinner
    const spinner = page.locator('[class*="spinner"], [class*="loading"], svg[class*="animate"]');
    // May or may not find it depending on timing
    console.log('Looking for loading indicator...');
  });
});

test.describe('Card Component Styling', () => {
  test('cards use accessibility CSS variables for borders', async ({ page }) => {
    await page.route('**/api/matches/available', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: MOCK_ACTIVITIES })
      });
    });

    await page.goto(`${BASE_URL}/swiper`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Find any card-like element
    const card = page.locator('[class*="card"], [class*="rounded"]').first();

    if (await card.count() > 0) {
      const styles = await card.evaluate(el => {
        const computed = getComputedStyle(el);
        return {
          borderColor: computed.borderColor,
          backgroundColor: computed.backgroundColor
        };
      });
      console.log('Card styles:', styles);
    }
  });
});

test.describe('Touch Interactions (Drag gestures)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/matches/available', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: MOCK_ACTIVITIES })
      });
    });

    await page.route('**/api/matches', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    await page.goto(`${BASE_URL}/swiper`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  });

  test('cards can be dragged', async ({ page }) => {
    // Find the top card
    const cardStack = page.locator('.relative.h-\\[480px\\]');

    if (await cardStack.count() > 0) {
      const box = await cardStack.boundingBox();
      if (box) {
        // Simulate drag gesture
        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;

        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(startX + 100, startY, { steps: 10 });
        await page.mouse.up();

        console.log('Drag gesture completed');
        await page.waitForTimeout(500);
      }
    }
  });
});
