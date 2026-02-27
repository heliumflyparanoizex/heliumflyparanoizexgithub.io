const { test, expect } = require('@playwright/test');

test.describe('E2E Test for Page Load', () => {
  test.beforeEach(async ({ page }) => {
    // Uses baseURL from config
    await page.goto('/');
  });

  test('Page Title', async ({ page }) => {
    await expect(page).toHaveTitle(/Helium Fly ParanoizeX/);
  });

  test('Preloader Visibility', async ({ page }) => {
    const preloader = page.locator('#preloader');
    // It should be attached to the DOM and initially visible
    await expect(preloader).toBeVisible();

    // We can also verify that it disappears eventually if we want,
    // but the task is mainly about "load".
  });

  test('Hero Section Visibility', async ({ page }) => {
    const heroSection = page.locator('#inicio');
    await expect(heroSection).toBeAttached();

    const mainTitle = page.locator('h1.glitch-text');
    await expect(mainTitle).toContainText('HELIUM FLY PARANOIZEX');
  });

  test('3D Elements Existence', async ({ page }) => {
    const canvas = page.locator('#memsyn-sim');
    await expect(canvas).toBeVisible();

    // Additional check: verify the canvas has size > 0 to ensure layout occurred
    const box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  test('No Console Errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Now that we are serving via http, 404s for local assets should be real errors.
        // However, we might still have missing favicons or external blocked resources.
        // Let's be strict but allow known external failures if any.
        // For now, let's catch everything.
        errors.push(text);
      }
    });

    // Reload to capture startup errors
    await page.reload();

    // Allow scripts to execute and network requests to complete
    await page.waitForLoadState('networkidle');

    if (errors.length > 0) {
        console.error('Console errors found:', errors);
    }

    expect(errors).toEqual([]);
  });
});
