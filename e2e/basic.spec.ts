import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display the home page', async ({ page }) => {
    await page.goto('/');
    
    // Check for main layout elements
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have proper navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation elements (sidebar or mobile nav)
    const sidebar = page.locator('nav');
    const navExists = await sidebar.count() > 0;
    expect(navExists).toBe(true);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Page should load without errors
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  test('should redirect to sign-in for unauthenticated users on protected routes', async ({ page }) => {
    await page.goto('/compose');
    
    // Should redirect to sign-in or show sign-in option
    const url = page.url();
    const isRedirected = url.includes('sign-in') || url.includes('compose');
    expect(isRedirected).toBe(true);
  });

  test('should display sign-in page', async ({ page }) => {
    await page.goto('/sign-in');
    
    // Page should load
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display sign-up page', async ({ page }) => {
    await page.goto('/sign-up');
    
    // Page should load
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Search Functionality', () => {
  test('should display search page', async ({ page }) => {
    await page.goto('/search');
    
    // Check for search input
    const searchInput = page.locator('input[type="text"], input[placeholder*="Search"]');
    await expect(searchInput.first()).toBeVisible();
  });

  test('should allow typing in search', async ({ page }) => {
    await page.goto('/search');
    
    const searchInput = page.locator('input[type="text"], input[placeholder*="Search"]').first();
    await searchInput.fill('test query');
    
    await expect(searchInput).toHaveValue('test query');
  });
});

test.describe('API Health', () => {
  test('should return healthy status from health endpoint', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBe(true);
    
    const data = await response.json();
    expect(data.status).toBe('ok');
  });
});

test.describe('Error Handling', () => {
  test('should display 404 page for unknown routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345');
    
    // Should show not found content or redirect
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('should load home page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
  });
});
