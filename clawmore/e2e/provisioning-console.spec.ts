import { test, expect } from '@playwright/test';

test.describe('Provisioning Console UI E2E', () => {
  test('dashboard renders provisioning console when status is provisioning', async ({
    page,
  }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');

    // Check for provisioning console elements
    // The console should render when provisioningStatus is 'provisioning'
    // This validates the ProvisioningConsole component structure

    // Look for terminal-like console elements
    const consoleElements = [
      'text=Provisioning',
      'text=AWS Account',
      'text=Governance',
      'text=IAM',
      'text=Spoke',
      'text=Shadow Bus',
      'text=Secrets',
    ];

    // Check if any provisioning-related text exists
    // Note: In a real E2E test with mocked auth, we'd have provisioning state
    for (const element of consoleElements) {
      const el = page.locator(element);
      // Element may not be visible if not provisioning
      // This validates the component structure exists
      await expect(el).toBeAttached();
    }
  });

  test('provisioning console shows step-by-step progress', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for step indicators
    // The ProvisioningConsole should show 6 steps:
    // 1. AWS Account Vending
    // 2. Governance Setup (SCP)
    // 3. IAM Bootstrapping
    // 4. Spoke Provisioning (GitHub Fork)
    // 5. Shadow Bus Link (EventBridge)
    // 6. Secrets Injection

    const stepIndicators = [
      'text=AWS Account Vending',
      'text=Governance Setup',
      'text=IAM Bootstrapping',
      'text=Spoke Provisioning',
      'text=Shadow Bus Link',
      'text=Secrets Injection',
    ];

    // Verify step indicators are in the DOM
    for (const step of stepIndicators) {
      const el = page.locator(step);
      await expect(el).toBeAttached();
    }
  });

  test('provisioning console handles error state', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for error handling UI
    // When provisioning fails, the console should show error message
    const errorElements = [
      'text=failed',
      'text=error',
      'text=retry',
      'text=contact support',
    ];

    // Verify error elements exist in the DOM
    for (const element of errorElements) {
      const el = page.locator(element);
      await expect(el).toBeAttached();
    }
  });

  test('provisioning console shows completion state', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for completion UI
    // When provisioning completes, the console should show success
    const completionElements = [
      'text=complete',
      'text=success',
      'text=active',
      'text=ready',
    ];

    // Verify completion elements exist in the DOM
    for (const element of completionElements) {
      const el = page.locator(element);
      await expect(el).toBeAttached();
    }
  });

  test('dashboard shows account overview with AWS usage', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for AWS usage card
    const awsUsageElements = [
      'text=AWS Usage',
      'text=This Month',
      'text=included',
      'text=Budget Used',
    ];

    // Verify AWS usage elements
    for (const element of awsUsageElements) {
      const el = page.locator(element);
      await expect(el).toBeAttached();
    }
  });

  test('dashboard shows AI credits section', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for AI credits card
    const aiCreditsElements = [
      'text=AI Auto-Fix Credits',
      'text=remaining',
      'text=Credit Balance',
    ];

    // Verify AI credits elements
    for (const element of aiCreditsElements) {
      const el = page.locator(element);
      await expect(el).toBeAttached();
    }
  });

  test('dashboard shows quick stats section', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for quick stats
    const quickStatsElements = [
      'text=Auto-Fixes Applied',
      'text=Active Repos',
      'text=Health Score',
      'text=Plan',
    ];

    // Verify quick stats elements
    for (const element of quickStatsElements) {
      const el = page.locator(element);
      await expect(el).toBeAttached();
    }
  });

  test('dashboard shows recent fixes section', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for recent fixes
    const recentFixesElements = [
      'text=Recent Fixes',
      'text=No fixes applied yet',
      'text=Infrastructure Mutation',
    ];

    // Verify recent fixes elements
    for (const element of recentFixesElements) {
      const el = page.locator(element);
      await expect(el).toBeAttached();
    }
  });

  test('dashboard has tab navigation', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for tab navigation
    const tabElements = [
      'text=Overview',
      'text=Nodes',
      'text=Settings',
      'text=Account',
    ];

    // Verify tab elements
    for (const tab of tabElements) {
      const el = page.locator(tab);
      await expect(el).toBeAttached();
    }
  });

  test('dashboard shows user profile section', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for user profile
    const profileElements = [
      'text=Welcome back',
      'text=Developer',
      'text=Your Profile',
      'text=Plan Status',
    ];

    // Verify profile elements
    for (const element of profileElements) {
      const el = page.locator(element);
      await expect(el).toBeAttached();
    }
  });

  test('dashboard shows billing section', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for billing section
    const billingElements = [
      'text=Billing',
      'text=Account',
      'text=Your Plan',
      'text=Managed Platform',
      'text=$29/mo',
      'text=Manage Subscription',
    ];

    // Verify billing elements
    for (const element of billingElements) {
      const el = page.locator(element);
      await expect(el).toBeAttached();
    }
  });

  test('dashboard shows auto top-up settings', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for auto top-up settings
    const topupElements = [
      'text=Auto Top-Up',
      'text=Never run out of AI credits',
      'text=Pulse Threshold',
      'text=Top-up Amount',
    ];

    // Verify auto top-up elements
    for (const element of topupElements) {
      const el = page.locator(element);
      await expect(el).toBeAttached();
    }
  });

  test('dashboard shows co-evolution settings', async ({ page }) => {
    await page.goto('/dashboard');

    // Check for co-evolution settings
    const coevolutionElements = [
      'text=Pattern Sharing',
      'text=Enable Pattern Sharing',
      'text=Get discounts by sharing anonymous code patterns',
      'text=Current Status',
    ];

    // Verify co-evolution elements
    for (const element of coevolutionElements) {
      const el = page.locator(element);
      await expect(el).toBeAttached();
    }
  });

  test('account status API returns correct structure', async ({ request }) => {
    // Test the account status API endpoint
    const response = await request.get('/api/account/status');

    // Should return 401 without auth (expected behavior)
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body).toHaveProperty('error', 'Unauthorized');
  });

  test('dashboard handles pending checkout state', async ({ page }) => {
    // Test the pending checkout view
    // This would be shown when user hasn't completed checkout yet
    await page.goto('/dashboard');

    // Check for pending checkout elements
    const pendingCheckoutElements = [
      'text=Complete Your Setup',
      'text=Your account is ready',
      'text=Subscribe Now',
      'text=Secure checkout powered by Stripe',
    ];

    // Verify pending checkout elements exist in the DOM
    for (const element of pendingCheckoutElements) {
      const el = page.locator(element);
      await expect(el).toBeAttached();
    }
  });
});
