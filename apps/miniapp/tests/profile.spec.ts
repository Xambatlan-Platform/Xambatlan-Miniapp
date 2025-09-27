import { test, expect } from '@playwright/test';

test.describe('Profile Management', () => {
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

      // Set up mock user data in localStorage
      const mockUser = {
        id: 'user_test',
        worldId: 'mock_nullifier_hash',
        verificationLevel: 'orb',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('isAuthenticated', 'true');
    });
  });

  test('should show profile creation form for new users', async ({ page }) => {
    await page.goto('/profile');

    // Should show profile creation form
    await expect(page.locator('h2:has-text("Create Your Profile")')).toBeVisible();

    // Should have profile type selection
    await expect(page.locator('text=I am a:')).toBeVisible();
    await expect(page.locator('button:has-text("🔨 Service Provider")')).toBeVisible();
    await expect(page.locator('button:has-text("🏠 Client")')).toBeVisible();

    // Should have avatar selection
    await expect(page.locator('text=Choose Avatar')).toBeVisible();

    // Should have username input
    await expect(page.locator('input[placeholder="Enter your username"]')).toBeVisible();

    // Should have bio textarea
    await expect(page.locator('textarea[placeholder*="Describe your services"]')).toBeVisible();

    // Should have contact info inputs
    await expect(page.locator('input[placeholder="WhatsApp number"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Email address"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Website or social media"]')).toBeVisible();
  });

  test('should create a provider profile', async ({ page }) => {
    await page.goto('/profile');

    // Select provider type
    await page.click('button:has-text("🔨 Service Provider")');

    // Select avatar
    await page.click('[data-testid="avatar-👨‍💼"], .text-2xl:has-text("👨‍💼")').first();

    // Fill username
    await page.fill('input[placeholder="Enter your username"]', 'test_provider');

    // Fill bio
    await page.fill('textarea[placeholder*="Describe your services"]', 'Experienced handyman providing quality home repair services.');

    // Fill contact info
    await page.fill('input[placeholder="WhatsApp number"]', '+1234567890');
    await page.fill('input[placeholder="Email address"]', 'test@example.com');

    // Create profile
    await page.click('button:has-text("Create Profile")');

    // Should show profile display
    await expect(page.locator('h2:has-text("test_provider")')).toBeVisible();
    await expect(page.locator('text=🔨 Service Provider')).toBeVisible();
    await expect(page.locator('text=Experienced handyman providing quality home repair services.')).toBeVisible();
  });

  test('should create a client profile', async ({ page }) => {
    await page.goto('/profile');

    // Select client type
    await page.click('button:has-text("🏠 Client")');

    // Select avatar
    await page.click('[data-testid="avatar-👤"], .text-2xl:has-text("👤")').first();

    // Fill username
    await page.fill('input[placeholder="Enter your username"]', 'test_client');

    // Fill bio (placeholder changes for client)
    await page.fill('textarea[placeholder*="Tell us about yourself"]', 'Looking for reliable home services.');

    // Create profile
    await page.click('button:has-text("Create Profile")');

    // Should show profile display
    await expect(page.locator('h2:has-text("test_client")')).toBeVisible();
    await expect(page.locator('text=🏠 Client')).toBeVisible();
  });

  test('should navigate to different sections from profile', async ({ page }) => {
    // First create a profile
    await page.goto('/profile');
    await page.click('button:has-text("🔨 Service Provider")');
    await page.click('.text-2xl:has-text("👤")').first();
    await page.fill('input[placeholder="Enter your username"]', 'test_user');
    await page.fill('textarea[placeholder*="Describe your services"]', 'Test bio');
    await page.click('button:has-text("Create Profile")');

    // Should show navigation buttons
    await expect(page.locator('button:has-text("🛠️ Manage My Services")')).toBeVisible();
    await expect(page.locator('button:has-text("📋 My Deals")')).toBeVisible();
    await expect(page.locator('button:has-text("⭐ Reviews")')).toBeVisible();

    // Test navigation to services
    await page.click('button:has-text("🛠️ Manage My Services")');
    await expect(page).toHaveURL('/services');

    // Go back to profile
    await page.goto('/profile');

    // Test navigation to deals
    await page.click('button:has-text("📋 My Deals")');
    await expect(page).toHaveURL('/deals');

    // Go back to profile
    await page.goto('/profile');

    // Test navigation to reviews
    await page.click('button:has-text("⭐ Reviews")');
    await expect(page).toHaveURL('/reviews');
  });

  test('should edit existing profile', async ({ page }) => {
    // First create a profile
    await page.goto('/profile');
    await page.click('button:has-text("🔨 Service Provider")');
    await page.click('.text-2xl:has-text("👤")').first();
    await page.fill('input[placeholder="Enter your username"]', 'original_name');
    await page.fill('textarea[placeholder*="Describe your services"]', 'Original bio');
    await page.click('button:has-text("Create Profile")');

    // Click edit button
    await page.click('button:has-text("Edit")');

    // Should show edit form
    await expect(page.locator('h2:has-text("Edit Profile")')).toBeVisible();

    // Change username
    await page.fill('input[value="original_name"]', 'updated_name');

    // Update profile
    await page.click('button:has-text("Update Profile")');

    // Should show updated profile
    await expect(page.locator('h2:has-text("updated_name")')).toBeVisible();
  });
});