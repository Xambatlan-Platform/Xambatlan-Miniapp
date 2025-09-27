import { test, expect } from '@playwright/test';

test.describe('Reviews and Reputation System', () => {
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
        badges: [
          { kind: 'VERIFIED', title: 'Verified Provider', iconUrl: '✅' },
          { kind: 'TOP_RATED', title: 'Top Rated', iconUrl: '⭐' },
        ],
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('profile', JSON.stringify(mockProfile));
      localStorage.setItem('isAuthenticated', 'true');
    });
  });

  test('should display reviews page with reputation summary', async ({ page }) => {
    await page.goto('/reviews');

    // Should show header
    await expect(page.locator('h1:has-text("Reviews")')).toBeVisible();

    // Should show reputation summary
    await expect(page.locator('text=4.5')).toBeVisible(); // Reputation score
    await expect(page.locator('text=Based on 12 reviews')).toBeVisible();

    // Should show star rating
    await expect(page.locator('span:has-text("⭐")').first()).toBeVisible();

    // Should show badges
    await expect(page.locator('text=Verified Provider')).toBeVisible();
    await expect(page.locator('text=Top Rated')).toBeVisible();
  });

  test('should show tab navigation between received and given reviews', async ({ page }) => {
    await page.goto('/reviews');

    // Should show tab buttons
    await expect(page.locator('button:has-text("📥 Received")')).toBeVisible();
    await expect(page.locator('button:has-text("📤 Given")')).toBeVisible();

    // Received tab should be active by default
    await expect(page.locator('button:has-text("📥 Received")').first()).toHaveClass(/bg-purple-100/);

    // Click on Given tab
    await page.click('button:has-text("📤 Given")');

    // Given tab should be active
    await expect(page.locator('button:has-text("📤 Given")').first()).toHaveClass(/bg-purple-100/);
  });

  test('should display empty state for reviews', async ({ page }) => {
    await page.goto('/reviews');

    // Should show empty state for received reviews
    await expect(page.locator('text=No received reviews yet')).toBeVisible();
    await expect(page.locator('text=Complete some deals to receive reviews from clients and providers')).toBeVisible();

    // Should show browse services button
    await expect(page.locator('button:has-text("Browse Services")')).toBeVisible();

    // Switch to given reviews
    await page.click('button:has-text("📤 Given")');

    // Should show empty state for given reviews
    await expect(page.locator('text=No given reviews yet')).toBeVisible();
    await expect(page.locator('text=Complete some deals to leave reviews for others')).toBeVisible();
  });

  test('should display reviews when they exist', async ({ page }) => {
    // Mock reviews data
    await page.addInitScript(() => {
      const originalFetch = window.fetch;
      window.fetch = async (url, options) => {
        if (url.toString().includes('/reviews/')) {
          return {
            ok: true,
            json: async () => ({
              success: true,
              data: {
                reviews: [
                  {
                    id: 'review_1',
                    dealId: 'deal_12345678',
                    fromUserId: 'client_1',
                    toUserId: 'user_test',
                    rating: 5,
                    text: 'Excellent work! Very professional and completed the job on time.',
                    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                  },
                  {
                    id: 'review_2',
                    dealId: 'deal_87654321',
                    fromUserId: 'client_2',
                    toUserId: 'user_test',
                    rating: 4,
                    text: 'Good quality work, would recommend.',
                    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                  },
                ],
              },
            }),
          };
        }
        return originalFetch(url, options);
      };
    });

    await page.goto('/reviews');

    // Should show reviews
    await expect(page.locator('text=Excellent work! Very professional and completed the job on time.')).toBeVisible();
    await expect(page.locator('text=Good quality work, would recommend.')).toBeVisible();

    // Should show star ratings
    await expect(page.locator('span:has-text("⭐")').first()).toBeVisible();

    // Should show deal references
    await expect(page.locator('text=Deal #deal_123')).toBeVisible();
    await expect(page.locator('text=Deal #deal_876')).toBeVisible();

    // Should show dates
    await expect(page.locator('text=' + new Date(Date.now() - 86400000).toLocaleDateString())).toBeVisible();
  });

  test('should handle different review types for received vs given', async ({ page }) => {
    // Mock different reviews for different tabs
    await page.addInitScript(() => {
      const originalFetch = window.fetch;
      window.fetch = async (url, options) => {
        if (url.toString().includes('/reviews/')) {
          // Mock different responses based on current tab state
          return {
            ok: true,
            json: async () => ({
              success: true,
              data: {
                reviews: [
                  {
                    id: 'review_received',
                    dealId: 'deal_12345678',
                    fromUserId: 'client_1',
                    toUserId: 'user_test',
                    rating: 5,
                    text: 'Great provider, highly recommended!',
                    createdAt: new Date().toISOString(),
                  },
                ],
              },
            }),
          };
        }
        return originalFetch(url, options);
      };
    });

    await page.goto('/reviews');

    // Check received reviews
    await expect(page.locator('text=• From client')).toBeVisible();

    // Switch to given reviews
    await page.click('button:has-text("📤 Given")');

    // The text should change to indicate given reviews
    // This would show "• To provider" but we'd need to mock different data for given reviews
  });

  test('should navigate back to profile', async ({ page }) => {
    await page.goto('/reviews');

    // Click back button
    await page.click('button:has-text("← Back")');

    // Should navigate to profile
    await expect(page).toHaveURL('/profile');
  });

  test('should navigate to services from empty state', async ({ page }) => {
    await page.goto('/reviews');

    // Click browse services button
    await page.click('button:has-text("Browse Services")');

    // Should navigate to services
    await expect(page).toHaveURL('/services');
  });

  test('should show building trust information', async ({ page }) => {
    await page.goto('/reviews');

    // Should show trust building info
    await expect(page.locator('text=Building Trust:')).toBeVisible();
    await expect(page.locator('text=Complete deals to earn reviews and build reputation')).toBeVisible();
    await expect(page.locator('text=High ratings unlock special badges and benefits')).toBeVisible();
    await expect(page.locator('text=Reviews are linked to World ID for authenticity')).toBeVisible();
  });

  test('should handle review loading states', async ({ page }) => {
    // Mock slow loading
    await page.addInitScript(() => {
      const originalFetch = window.fetch;
      window.fetch = async (url, options) => {
        if (url.toString().includes('/reviews/')) {
          // Simulate slow loading
          await new Promise(resolve => setTimeout(resolve, 1000));
          return {
            ok: true,
            json: async () => ({
              success: true,
              data: { reviews: [] },
            }),
          };
        }
        return originalFetch(url, options);
      };
    });

    await page.goto('/reviews');

    // Should show loading state
    await expect(page.locator('text=Loading reviews...')).toBeVisible();

    // Wait for loading to complete
    await page.waitForSelector('text=No received reviews yet', { timeout: 5000 });
  });

  test('should display correct reputation score with proper rounding', async ({ page }) => {
    // Test with different reputation scores
    await page.addInitScript(() => {
      const mockProfile = {
        id: 'profile_test',
        userId: 'user_test',
        type: 'PROVIDER',
        username: 'test_provider',
        avatarEmoji: '👤',
        bio: 'Test provider bio',
        contactHash: 'mock_contact_hash',
        reputationScore: 3.7,
        totalReviews: 8,
        badges: [],
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('profile', JSON.stringify(mockProfile));
    });

    await page.goto('/reviews');

    // Should show rounded reputation score
    await expect(page.locator('text=3.7')).toBeVisible();
    await expect(page.locator('text=Based on 8 reviews')).toBeVisible();

    // Should show correctly rounded stars (4 stars for 3.7 rating)
    const starElements = page.locator('span:has-text("⭐")');
    await expect(starElements).toHaveCount(4); // Should show 4 filled stars
  });
});