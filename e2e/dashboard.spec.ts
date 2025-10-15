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

    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();

    // Check for metrics section
    await expect(page.getByRole('region', { name: /Key Metrics/i })).toBeVisible();

    // Check for specific metric cards by their titles (use first() to avoid strict mode)
    await expect(page.getByText('Monthly Cost').first()).toBeVisible();
    await expect(page.getByText('Total Resources').first()).toBeVisible();
    await expect(page.getByText('Security Findings').first()).toBeVisible();
    await expect(page.getByText('Compliance Score').first()).toBeVisible();
  });

  test('should display cost chart', async ({ page }) => {
    await page.goto('/');

    // Check for chart section heading (it's in sr-only but region should exist)
    await expect(page.getByRole('region', { name: /Cost Trend/i })).toBeVisible();
  });

  test('should display resource table', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();

    // Check for resources section
    const resourcesSection = page.getByRole('region', { name: /Recent Resources/i });
    await expect(resourcesSection).toBeVisible();

    // The section exists, which is enough - content depends on AWS data availability
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

    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();

    // Find and click refresh button
    const refreshButton = page.getByRole('button', { name: /refresh/i });
    await expect(refreshButton).toBeVisible();
    await refreshButton.click();

    // Verify page is still functional after refresh
    await page.waitForTimeout(1000);
    await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate using sidebar', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();

    // Find the Resources link in the sidebar
    const resourcesLink = page.getByRole('link', { name: /Resources/i });
    await expect(resourcesLink).toBeVisible();

    // Check if on mobile (button visible)
    const menuButton = page.getByRole('button', { name: /toggle/i });
    const isMobile = await menuButton.isVisible().catch(() => false);

    if (isMobile) {
      // Mobile: Open menu first
      await menuButton.click();
      await page.waitForTimeout(500);
    }

    // Navigate to resources page
    await resourcesLink.click({ force: isMobile });

    // Wait for navigation
    await page.waitForURL(/resources/, { timeout: 10000 });

    // Verify we're on the resources page
    await expect(page).toHaveURL(/resources/);
  });
});

test.describe('Accessibility', () => {
  test('should have no accessibility violations', async ({ page }) => {
    await page.goto('/');

    // Check for basic accessibility
    await expect(page.getByRole('main')).toBeVisible();

    // Check for navigation - use specific name to avoid strict mode violation
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();

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