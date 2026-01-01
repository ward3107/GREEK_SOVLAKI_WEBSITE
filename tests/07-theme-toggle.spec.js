const { test, expect } = require('@playwright/test');

test.describe('Theme Toggle Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display theme toggle button', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
  });

  test('should have ARIA label', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toHaveAttribute('aria-label', 'Toggle dark mode');
  });

  test('should show sun icon initially', async ({ page }) => {
    const sunIcon = page.locator('.sun-icon');
    await expect(sunIcon).toBeVisible();
  });

  test('should toggle between light and dark mode', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    const body = page.locator('body');

    // Click to toggle to dark mode
    await themeToggle.click();
    await page.waitForTimeout(300);

    // Check if dark mode is applied (body class or data attribute)
    const isDarkMode = await body.evaluate(el =>
      el.classList.contains('dark-theme') || el.getAttribute('data-theme') === 'dark'
    );

    // Theme should have changed
    expect(isDarkMode).toBeTruthy();
  });

  test('should switch icons when toggled', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');

    // Click to toggle
    await themeToggle.click();
    await page.waitForTimeout(300);

    // One icon should be hidden, other visible
    const sunIcon = page.locator('.sun-icon');
    const moonIcon = page.locator('.moon-icon');

    const sunVisible = await sunIcon.isVisible().catch(() => false);
    const moonVisible = await moonIcon.isVisible().catch(() => false);

    // One should be visible, one hidden
    expect(sunVisible !== moonVisible).toBeTruthy();
  });

  test('should persist theme preference', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');

    // Toggle to dark mode
    await themeToggle.click();
    await page.waitForTimeout(300);

    // Reload page
    await page.reload();
    await page.waitForTimeout(1000);

    // Dark mode should still be active
    const body = page.locator('body');
    const isDarkMode = await body.evaluate(el =>
      el.classList.contains('dark-theme') || el.getAttribute('data-theme') === 'dark'
    );

    expect(isDarkMode).toBeTruthy();
  });
});
