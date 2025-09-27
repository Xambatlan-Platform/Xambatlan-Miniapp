import { test, expect } from '@playwright/test';

test.describe('Pay-to-Reveal Contact Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state with client profile
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
        pay: async (payload: any) => ({
          success: true,
          data: {
            transaction_id: 'mock_tx_' + Date.now(),
            status: 'confirmed',
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

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('profile', JSON.stringify(mockProfile));
      localStorage.setItem('isAuthenticated', 'true');
    });
  });

  test('should display pay-to-reveal interface', async ({ page }) => {
    await page.goto('/reveal/service_1');

    // Should show service information
    await expect(page.locator('text=Pay-to-Reveal Contact')).toBeVisible();
    await expect(page.locator('text=House Repairs & Masonry')).toBeVisible();
    await expect(page.locator('text=maria_constructor')).toBeVisible();

    // Should show payment details
    await expect(page.locator('text=$5 USDC')).toBeVisible();
    await expect(page.locator('text=One-time payment to reveal contact')).toBeVisible();

    // Should show payment button
    await expect(page.locator('button:has-text("💰 Pay with MiniKit")')).toBeVisible();

    // Should show escrow explanation
    await expect(page.locator('text=How it works:')).toBeVisible();
    await expect(page.locator('text=Pay $5 USDC to reveal contact information')).toBeVisible();
    await expect(page.locator('text=Provider must consent before contact is revealed')).toBeVisible();
  });

  test('should process payment and show pending state', async ({ page }) => {
    await page.goto('/reveal/service_1');

    // Click pay button
    await page.click('button:has-text("💰 Pay with MiniKit")');

    // Should show payment processing
    await expect(page.locator('text=Processing payment...')).toBeVisible();

    // Wait for payment to complete
    await page.waitForSelector('text=Payment successful!', { timeout: 5000 });

    // Should show pending consent state
    await expect(page.locator('text=Waiting for provider consent')).toBeVisible();
    await expect(page.locator('text=We\'ve notified maria_constructor about your request')).toBeVisible();
  });

  test('should handle payment errors', async ({ page }) => {
    // Mock payment failure
    await page.addInitScript(() => {
      if (window.MiniKit) {
        window.MiniKit.pay = async (payload: any) => {
          throw new Error('Payment failed');
        };
      }
    });

    await page.goto('/reveal/service_1');

    // Click pay button
    await page.click('button:has-text("💰 Pay with MiniKit")');

    // Should show error message
    await expect(page.locator('text=Payment failed')).toBeVisible();

    // Should show retry button
    await expect(page.locator('button:has-text("🔄 Try Again")')).toBeVisible();
  });

  test('should simulate provider consent and reveal contact', async ({ page }) => {
    await page.goto('/reveal/service_1');

    // Process payment
    await page.click('button:has-text("💰 Pay with MiniKit")');
    await page.waitForSelector('text=Payment successful!', { timeout: 5000 });

    // Simulate provider consent by clicking the mock consent button
    await page.click('button:has-text("✅ Simulate Provider Consent")');

    // Should show revealed contact information
    await expect(page.locator('text=Contact Revealed!')).toBeVisible();
    await expect(page.locator('text=WhatsApp:')).toBeVisible();
    await expect(page.locator('text=+52 55 1234 5678')).toBeVisible();
    await expect(page.locator('text=Email:')).toBeVisible();
    await expect(page.locator('text=maria@construcciones.mx')).toBeVisible();

    // Should show create deal button
    await expect(page.locator('button:has-text("🤝 Create Deal")')).toBeVisible();
  });

  test('should handle provider rejection', async ({ page }) => {
    await page.goto('/reveal/service_1');

    // Process payment
    await page.click('button:has-text("💰 Pay with MiniKit")');
    await page.waitForSelector('text=Payment successful!', { timeout: 5000 });

    // Simulate provider rejection
    await page.click('button:has-text("❌ Simulate Provider Rejection")');

    // Should show rejection message
    await expect(page.locator('text=Request Declined')).toBeVisible();
    await expect(page.locator('text=The provider has declined to share their contact')).toBeVisible();
    await expect(page.locator('text=Your payment will be refunded')).toBeVisible();

    // Should show browse other services button
    await expect(page.locator('button:has-text("🔍 Browse Other Services")')).toBeVisible();
  });

  test('should navigate back to services', async ({ page }) => {
    await page.goto('/reveal/service_1');

    // Click back button
    await page.click('button:has-text("← Back")');

    // Should return to services page
    await expect(page).toHaveURL('/services');
  });

  test('should show MiniKit not available message', async ({ page }) => {
    // Mock MiniKit as not available
    await page.addInitScript(() => {
      window.MiniKit = undefined;
    });

    await page.goto('/reveal/service_1');

    // Click pay button
    await page.click('button:has-text("💰 Pay with MiniKit")');

    // Should show MiniKit not available message
    await expect(page.locator('text=MiniKit not available')).toBeVisible();
  });

  test('should create deal after contact revelation', async ({ page }) => {
    await page.goto('/reveal/service_1');

    // Complete payment and consent flow
    await page.click('button:has-text("💰 Pay with MiniKit")');
    await page.waitForSelector('text=Payment successful!', { timeout: 5000 });
    await page.click('button:has-text("✅ Simulate Provider Consent")');

    // Click create deal
    await page.click('button:has-text("🤝 Create Deal")');

    // Should show deal creation form or navigate to deals
    // This would depend on the implementation
    await expect(page.locator('text=Deal')).toBeVisible();
  });
});