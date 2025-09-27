import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display landing page and authentication button', async ({ page }) => {
    await page.goto('/');

    // Check for main heading
    await expect(page.locator('h1')).toContainText('Xambatlán');

    // Check for subtitle
    await expect(page.locator('text=Trust-ranking Mini App for World App')).toBeVisible();

    // Check for authentication section
    await expect(page.locator('text=World ID Authentication')).toBeVisible();

    // Check for auth button
    await expect(page.locator('button:has-text("Verify with World ID")')).toBeVisible();
  });

  test('should show MiniKit not detected message for non-World App environment', async ({ page }) => {
    await page.goto('/');

    // Click the auth button
    await page.click('button:has-text("Verify with World ID")');

    // Should show MiniKit not detected message
    await expect(page.locator('text=MiniKit not detected')).toBeVisible();

    // Should show retry button
    await expect(page.locator('button:has-text("🔄 Retry Detection")')).toBeVisible();
  });

  test('should simulate World ID verification in mock environment', async ({ page }) => {
    await page.goto('/');

    // Mock the MiniKit object
    await page.addInitScript(() => {
      window.MiniKit = {
        isInstalled: () => true,
        verify: async (payload: any) => {
          // Mock successful verification
          return {
            success: true,
            data: {
              nullifier_hash: 'mock_nullifier_hash',
              verification_level: 'orb',
              merkle_root: 'mock_merkle_root',
              proof: 'mock_proof',
            },
          };
        },
      };
    });

    // Click the auth button
    await page.click('button:has-text("Verify with World ID")');

    // Should redirect to profile page
    await expect(page).toHaveURL('/profile');
  });

  test('should handle authentication error gracefully', async ({ page }) => {
    await page.goto('/');

    // Mock MiniKit with error
    await page.addInitScript(() => {
      window.MiniKit = {
        isInstalled: () => true,
        verify: async (payload: any) => {
          throw new Error('Verification failed');
        },
      };
    });

    // Click the auth button
    await page.click('button:has-text("Verify with World ID")');

    // Should show error message
    await expect(page.locator('text=Verification failed')).toBeVisible();
  });
});