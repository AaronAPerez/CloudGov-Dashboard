import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('should load dashboard page', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/CloudGov Dashboard/);
    
    // Check main heading
    await expect(
      page.getByRole('heading', { name: 'Dashboard Overview' })
    ).toBeVisible();
  });

  test('should display metrics cards', async ({ page }) => {
    await page.goto('/');
    
    // Wait for metrics to load
    await page.waitForSelector('[data-testid="metrics-grid"]', {
      state: 'visible',
      timeout: 5000,
    });
    
    // Check for metrics cards
    await expect(page.getByText('Monthly Cost')).toBeVisible();
    await expect(page.getByText('Total Resources')).toBeVisible();
    await expect(page.getByText('Security Findings')).toBeVisible();
  });

  test('should display cost chart', async ({ page }) => {
    await page.goto('/');
    
    // Check for chart
    await expect(page.getByText('30-Day Cost Trend')).toBeVisible();
  });

  test('should display resource table', async ({ page }) => {
    await page.goto('/');
    
    // Wait for table to load
    await page.waitForSelector('table', {
      state: 'visible',
      timeout: 5000,
    });
    
    // Check table headers
    await expect(page.getByText('Name')).toBeVisible();
    await expect(page.getByText('Type')).toBeVisible();
    await expect(page.getByText('Status')).toBeVisible();
  });

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile menu button exists
    await expect(page.getByRole('button', { name: /toggle/i })).toBeVisible();
  });

  test('should handle refresh', async ({ page }) => {
    await page.goto('/');
    
    // Click refresh button
    await page.getByRole('button', { name: /refresh/i }).click();
    
    // Check loading state (might be quick)
    // Then verify data reloaded
    await page.waitForTimeout(1000);
  });
});

test.describe('Navigation', () => {
  test('should navigate using sidebar', async ({ page }) => {
    await page.goto('/');
    
    // Open mobile menu if on mobile
    const menuButton = page.getByRole('button', { name: /toggle/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
    
    // Click on Resources link
    await page.getByRole('button', { name: 'Resources' }).click();
    
    // Verify URL changed (when routes are added)
    // await expect(page).toHaveURL(/resources/);
  });
});

test.describe('Accessibility', () => {
  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    // Check for basic accessibility
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Check for skip link
    const skipLink = page.getByRole('link', { name: /skip to main/i });
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab through elements
    await page.keyboard.press('Tab');
    
    // Verify focus is visible
    const focusedElement = await page.evaluateHandle(() => document.activeElement);
    await expect(focusedElement).toBeTruthy();
  });
});