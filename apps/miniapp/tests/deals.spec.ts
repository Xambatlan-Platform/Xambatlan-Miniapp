import { test, expect } from '@playwright/test';

test.describe('Deal Management', () => {
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

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('profile', JSON.stringify(mockProfile));
      localStorage.setItem('isAuthenticated', 'true');
    });
  });

  test('should display empty deals state', async ({ page }) => {
    await page.goto('/deals');

    // Should show header
    await expect(page.locator('h1:has-text("My Deals")')).toBeVisible();

    // Should show empty state
    await expect(page.locator('text=No deals yet')).toBeVisible();
    await expect(page.locator('text=Start by browsing services and connecting with providers')).toBeVisible();

    // Should show browse services button
    await expect(page.locator('button:has-text("Browse Services")')).toBeVisible();
  });

  test('should navigate to services from empty state', async ({ page }) => {
    await page.goto('/deals');

    // Click browse services button
    await page.click('button:has-text("Browse Services")');

    // Should navigate to services page
    await expect(page).toHaveURL('/services');
  });

  test('should navigate back to profile', async ({ page }) => {
    await page.goto('/deals');

    // Click back button
    await page.click('button:has-text("← Back")');

    // Should navigate to profile
    await expect(page).toHaveURL('/profile');
  });

  test('should display deal information when deals exist', async ({ page }) => {
    // Mock deals data
    await page.addInitScript(() => {
      // Mock API response for deals
      const originalFetch = window.fetch;
      window.fetch = async (url, options) => {
        if (url.toString().includes('/deals')) {
          return {
            ok: true,
            json: async () => ({
              success: true,
              data: {
                items: [
                  {
                    id: 'deal_1',
                    serviceId: 'service_1',
                    clientId: 'client_1',
                    providerId: 'provider_1',
                    onChain: true,
                    amount: 500,
                    currency: 'USDC',
                    status: 'PENDING',
                    escrowTx: '0x1234567890abcdef1234567890abcdef12345678',
                    createdAt: new Date().toISOString(),
                  },
                  {
                    id: 'deal_2',
                    serviceId: 'service_2',
                    clientId: 'client_1',
                    providerId: 'provider_2',
                    onChain: false,
                    amount: 200,
                    currency: 'USDC',
                    status: 'ACTIVE',
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

    await page.goto('/deals');

    // Should show deals
    await expect(page.locator('text=Deal #deal_1')).toBeVisible();
    await expect(page.locator('text=Deal #deal_2')).toBeVisible();

    // Should show deal amounts
    await expect(page.locator('text=$500 USDC')).toBeVisible();
    await expect(page.locator('text=$200 USDC')).toBeVisible();

    // Should show deal types
    await expect(page.locator('text=🔗 On-chain Escrow')).toBeVisible();
    await expect(page.locator('text=📝 Off-chain Agreement')).toBeVisible();

    // Should show deal statuses
    await expect(page.locator('text=PENDING')).toBeVisible();
    await expect(page.locator('text=ACTIVE')).toBeVisible();

    // Should show escrow transaction for on-chain deal
    await expect(page.locator('text=0x123456...345678')).toBeVisible();
  });

  test('should show appropriate action buttons for different deal statuses', async ({ page }) => {
    // Mock deals with different statuses
    await page.addInitScript(() => {
      const originalFetch = window.fetch;
      window.fetch = async (url, options) => {
        if (url.toString().includes('/deals')) {
          return {
            ok: true,
            json: async () => ({
              success: true,
              data: {
                items: [
                  {
                    id: 'deal_pending',
                    serviceId: 'service_1',
                    clientId: 'client_1',
                    providerId: 'provider_1',
                    onChain: true,
                    amount: 500,
                    currency: 'USDC',
                    status: 'PENDING',
                    createdAt: new Date().toISOString(),
                  },
                  {
                    id: 'deal_active',
                    serviceId: 'service_2',
                    clientId: 'client_1',
                    providerId: 'provider_2',
                    onChain: false,
                    amount: 200,
                    currency: 'USDC',
                    status: 'ACTIVE',
                    createdAt: new Date().toISOString(),
                  },
                  {
                    id: 'deal_completed',
                    serviceId: 'service_3',
                    clientId: 'client_1',
                    providerId: 'provider_3',
                    onChain: true,
                    amount: 300,
                    currency: 'USDC',
                    status: 'COMPLETED',
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

    await page.goto('/deals');

    // For PENDING deals, should show Confirm and Cancel buttons
    await expect(page.locator('button:has-text("✅ Confirm")').first()).toBeVisible();
    await expect(page.locator('button:has-text("❌ Cancel")').first()).toBeVisible();

    // For ACTIVE deals, should show Mark as Complete button
    await expect(page.locator('button:has-text("✅ Mark as Complete")')).toBeVisible();

    // For COMPLETED deals, should show Leave Review button
    await expect(page.locator('button:has-text("⭐ Leave Review")')).toBeVisible();
  });

  test('should handle deal actions', async ({ page }) => {
    // Mock a pending deal
    await page.addInitScript(() => {
      const originalFetch = window.fetch;
      window.fetch = async (url, options) => {
        if (url.toString().includes('/deals')) {
          return {
            ok: true,
            json: async () => ({
              success: true,
              data: {
                items: [
                  {
                    id: 'deal_pending',
                    serviceId: 'service_1',
                    clientId: 'client_1',
                    providerId: 'provider_1',
                    onChain: true,
                    amount: 500,
                    currency: 'USDC',
                    status: 'PENDING',
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

    await page.goto('/deals');

    // Test confirm deal action
    await page.click('button:has-text("✅ Confirm")');
    // Should log the action (for now it just console.logs)

    // Test cancel deal action
    await page.click('button:has-text("❌ Cancel")');
    // Should log the action
  });

  test('should navigate to review creation from completed deal', async ({ page }) => {
    // Mock a completed deal
    await page.addInitScript(() => {
      const originalFetch = window.fetch;
      window.fetch = async (url, options) => {
        if (url.toString().includes('/deals')) {
          return {
            ok: true,
            json: async () => ({
              success: true,
              data: {
                items: [
                  {
                    id: 'deal_completed',
                    serviceId: 'service_1',
                    clientId: 'client_1',
                    providerId: 'provider_1',
                    onChain: true,
                    amount: 500,
                    currency: 'USDC',
                    status: 'COMPLETED',
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

    await page.goto('/deals');

    // Click leave review button
    await page.click('button:has-text("⭐ Leave Review")');

    // Should navigate to review creation page
    await expect(page).toHaveURL('/reviews/create?dealId=deal_completed');
  });

  test('should show deal types information card', async ({ page }) => {
    await page.goto('/deals');

    // Should show deal types info
    await expect(page.locator('text=Deal Types:')).toBeVisible();
    await expect(page.locator('text=On-chain: Funds held in smart contract escrow')).toBeVisible();
    await expect(page.locator('text=Off-chain: Agreement hash stored for disputes')).toBeVisible();
  });
});