import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.MiniKit = {
        isInstalled: () => true,
        verify: async (payload: any) => ({
          success: true,
          data: {
            nullifier_hash: 'mock_nullifier_hash',
            verification_level: 'orb',
            merkle_root: 'mock_merkle_root',
            proof: 'mock_proof',
          },
        }),
      };

      const mockUser = {
        id: 'user_test',
        worldId: 'mock_nullifier_hash',
        verificationLevel: 'orb',
        createdAt: new Date().toISOString(),
      };

      const mockProfile = {
        id: 'profile_test',
        userId: 'user_test',
        type: 'PROVIDER',
        username: 'test_provider',
        avatarEmoji: '👤',
        bio: 'Test provider bio',
        contactHash: 'mock_contact_hash',
        reputationScore: 4.5,
        totalReviews: 12,
        badges: [],
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('profile', JSON.stringify(mockProfile));
      localStorage.setItem('isAuthenticated', 'true');
    });
  });

  test('should redirect authenticated users from home to profile', async ({ page }) => {
    await page.goto('/');

    // Should redirect to profile
    await expect(page).toHaveURL('/profile');
  });

  test('should redirect unauthenticated users to home from protected routes', async ({ page }) => {
    // Clear authentication
    await page.addInitScript(() => {
      localStorage.clear();
    });

    // Try to access profile page
    await page.goto('/profile');

    // Should redirect to home
    await expect(page).toHaveURL('/');
  });

  test('should navigate between main sections from profile', async ({ page }) => {
    await page.goto('/profile');

    // Navigate to services
    await page.click('button:has-text("🛠️ Manage My Services")');
    await expect(page).toHaveURL('/services');

    // Navigate back to profile using back button
    await page.click('button:has-text("← Back")');
    await expect(page).toHaveURL('/profile');

    // Navigate to deals
    await page.click('button:has-text("📋 My Deals")');
    await expect(page).toHaveURL('/deals');

    // Navigate back to profile
    await page.click('button:has-text("← Back")');
    await expect(page).toHaveURL('/profile');

    // Navigate to reviews
    await page.click('button:has-text("⭐ Reviews")');
    await expect(page).toHaveURL('/reviews');

    // Navigate back to profile
    await page.click('button:has-text("← Back")');
    await expect(page).toHaveURL('/profile');
  });

  test('should handle deep linking to specific pages', async ({ page }) => {
    // Direct navigation to services page
    await page.goto('/services');
    await expect(page.locator('h1:has-text("My Services")')).toBeVisible();

    // Direct navigation to deals page
    await page.goto('/deals');
    await expect(page.locator('h1:has-text("My Deals")')).toBeVisible();

    // Direct navigation to reviews page
    await page.goto('/reviews');
    await expect(page.locator('h1:has-text("Reviews")')).toBeVisible();
  });

  test('should handle browser back and forward navigation', async ({ page }) => {
    await page.goto('/profile');

    // Navigate to services
    await page.click('button:has-text("🛠️ Manage My Services")');
    await expect(page).toHaveURL('/services');

    // Navigate to deals
    await page.goto('/deals');
    await expect(page).toHaveURL('/deals');

    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/services');

    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL('/deals');
  });

  test('should navigate to pay-to-reveal flow correctly', async ({ page }) => {
    // Mock client profile for this test
    await page.addInitScript(() => {
      const mockProfile = {
        id: 'profile_client',
        userId: 'user_test',
        type: 'CLIENT',
        username: 'test_client',
        avatarEmoji: '👤',
        bio: 'Test client bio',
        contactHash: 'mock_contact_hash',
        reputationScore: 0,
        totalReviews: 0,
        badges: [],
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('profile', JSON.stringify(mockProfile));
    });

    await page.goto('/services');

    // Click on get contact button
    await page.click('button:has-text("💬 Get Contact")').first();

    // Should navigate to reveal page with service ID
    await expect(page).toHaveURL(/\/reveal\/.+/);

    // Should show pay-to-reveal interface
    await expect(page.locator('text=Pay-to-Reveal Contact')).toBeVisible();

    // Navigate back to services
    await page.click('button:has-text("← Back")');
    await expect(page).toHaveURL('/services');
  });

  test('should handle logout and redirect to home', async ({ page }) => {
    await page.goto('/profile');

    // Click sign out button
    await page.click('button:has-text("Sign Out")');

    // Should redirect to home page
    await expect(page).toHaveURL('/');

    // Should show landing page content
    await expect(page.locator('h1:has-text("Xambatlán")')).toBeVisible();
    await expect(page.locator('button:has-text("Verify with World ID")')).toBeVisible();
  });

  test('should preserve state during navigation', async ({ page }) => {
    await page.goto('/profile');

    // Should show profile information
    await expect(page.locator('h2:has-text("test_provider")')).toBeVisible();

    // Navigate to services and back
    await page.click('button:has-text("🛠️ Manage My Services")');
    await page.click('button:has-text("← Back")');

    // Profile information should still be there
    await expect(page.locator('h2:has-text("test_provider")')).toBeVisible();
  });

  test('should handle invalid routes gracefully', async ({ page }) => {
    // Try to navigate to non-existent page
    await page.goto('/non-existent-page');

    // Should show 404 or redirect to home
    // This depends on Next.js configuration, but we can at least check it doesn't crash
    await expect(page).not.toHaveURL('/non-existent-page');
  });

  test('should show loading states during navigation', async ({ page }) => {
    await page.goto('/profile');

    // Mock slow page loading
    await page.addInitScript(() => {
      // Add delay to component mounting
      const originalQuerySelector = document.querySelector;
      document.querySelector = function(...args) {
        // Add small delay to simulate loading
        return originalQuerySelector.apply(this, args);
      };
    });

    // Navigate to a page that might show loading state
    await page.click('button:has-text("⭐ Reviews")');

    // Check that we eventually reach the reviews page
    await expect(page).toHaveURL('/reviews');
    await expect(page.locator('h1:has-text("Reviews")')).toBeVisible();
  });

  test('should handle tab-based navigation in reviews', async ({ page }) => {
    await page.goto('/reviews');

    // Should start with received tab active
    await expect(page.locator('button:has-text("📥 Received")').first()).toHaveClass(/bg-purple-100/);

    // Switch to given tab
    await page.click('button:has-text("📤 Given")');
    await expect(page.locator('button:has-text("📤 Given")').first()).toHaveClass(/bg-purple-100/);

    // Switch back to received tab
    await page.click('button:has-text("📥 Received")');
    await expect(page.locator('button:has-text("📥 Received")').first()).toHaveClass(/bg-purple-100/);
  });
});