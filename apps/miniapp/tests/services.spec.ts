import { test, expect } from '@playwright/test';

test.describe('Service Directory', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state with provider profile
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
        totalReviews: 10,
        badges: [{ kind: 'NEWCOMER', title: 'Newcomer', iconUrl: '🌟' }],
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('profile', JSON.stringify(mockProfile));
      localStorage.setItem('isAuthenticated', 'true');
    });
  });

  test('should display service directory for providers', async ({ page }) => {
    await page.goto('/services');

    // Should show header with manage services
    await expect(page.locator('h1:has-text("My Services")')).toBeVisible();

    // Should show create service button
    await expect(page.locator('button:has-text("➕ Create New Service")')).toBeVisible();

    // Should show empty state when no services
    await expect(page.locator('text=No services yet')).toBeVisible();
    await expect(page.locator('text=Create your first service to start earning')).toBeVisible();
  });

  test('should show service creation form', async ({ page }) => {
    await page.goto('/services');

    // Click create service button
    await page.click('button:has-text("➕ Create New Service")');

    // Should show service creation form
    await expect(page.locator('h2:has-text("Create New Service")')).toBeVisible();

    // Should have category selection
    await expect(page.locator('text=Category')).toBeVisible();
    await expect(page.locator('button:has-text("🏗️ Construction")')).toBeVisible();
    await expect(page.locator('button:has-text("🔧 Plumbing")')).toBeVisible();
    await expect(page.locator('button:has-text("⚡ Electrical")')).toBeVisible();

    // Should have service details inputs
    await expect(page.locator('input[placeholder="e.g., House Painting & Repair"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder*="Describe your service"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter base price in USD"]')).toBeVisible();

    // Should have service type options
    await expect(page.locator('button:has-text("💰 Fixed Price")')).toBeVisible();
    await expect(page.locator('button:has-text("⏰ Hourly Rate")')).toBeVisible();
    await expect(page.locator('button:has-text("💬 Quote Required")')).toBeVisible();
  });

  test('should create a new service', async ({ page }) => {
    await page.goto('/services');

    // Click create service
    await page.click('button:has-text("➕ Create New Service")');

    // Fill service form
    await page.click('button:has-text("🏗️ Construction")');
    await page.fill('input[placeholder="e.g., House Painting & Repair"]', 'House Painting Services');
    await page.fill('textarea[placeholder*="Describe your service"]', 'Professional house painting with high-quality materials and guaranteed results.');
    await page.fill('input[placeholder="Enter base price in USD"]', '500');
    await page.click('button:has-text("💰 Fixed Price")');

    // Create service
    await page.click('button:has-text("Create Service")');

    // Should redirect back to services list
    await expect(page.locator('h1:has-text("My Services")')).toBeVisible();

    // Should show success message or created service
    // Note: This depends on the implementation - might show the new service in the list
  });

  test('should display service directory for clients', async ({ page }) => {
    // Mock client profile
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

    // Should show browse services for clients
    await expect(page.locator('h1:has-text("Browse Services")')).toBeVisible();

    // Should show category filters
    await expect(page.locator('button:has-text("All Categories")')).toBeVisible();

    // Should show mock services
    await expect(page.locator('text=House Repairs & Masonry')).toBeVisible();
    await expect(page.locator('text=maria_constructor')).toBeVisible();
  });

  test('should filter services by category', async ({ page }) => {
    // Mock client profile
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

    // Click on construction category
    await page.click('button:has-text("🏗️ Construction")');

    // Should filter to only construction services
    await expect(page.locator('text=Construction')).toBeVisible();
  });

  test('should navigate to service details and pay-to-reveal flow', async ({ page }) => {
    // Mock client profile
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

    // Click on a service
    await page.click('button:has-text("💬 Get Contact")').first();

    // Should navigate to reveal page
    await expect(page).toHaveURL(/\/reveal\/.+/);

    // Should show pay-to-reveal interface
    await expect(page.locator('text=Pay-to-Reveal Contact')).toBeVisible();
    await expect(page.locator('text=$5 USDC')).toBeVisible();
    await expect(page.locator('button:has-text("💰 Pay with MiniKit")')).toBeVisible();
  });
});