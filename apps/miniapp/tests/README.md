# E2E Tests for Xambatlán Mini App

This directory contains comprehensive end-to-end tests for the Xambatlán Mini App using Playwright.

## Test Structure

### Test Files

1. **auth.spec.ts** - Authentication and World ID verification flow
2. **profile.spec.ts** - Profile creation and management
3. **services.spec.ts** - Service directory and listings
4. **pay-to-reveal.spec.ts** - Pay-to-reveal contact flow with MiniKit payments
5. **deals.spec.ts** - Deal management and status tracking
6. **reviews.spec.ts** - Review and reputation system
7. **navigation.spec.ts** - App navigation and routing

### Test Coverage

#### Authentication Flow (`auth.spec.ts`)
- Landing page display and components
- MiniKit detection in non-World App environments
- Mock World ID verification simulation
- Authentication error handling

#### Profile Management (`profile.spec.ts`)
- Profile creation form for new users
- Provider vs Client profile types
- Avatar selection and form validation
- Profile editing and updates
- Navigation from profile to other sections

#### Service Directory (`services.spec.ts`)
- Service listing for providers
- Service creation workflow
- Category filtering for clients
- Service browsing and discovery
- Navigation to pay-to-reveal flow

#### Pay-to-Reveal Contact (`pay-to-reveal.spec.ts`)
- Payment interface display
- MiniKit payment processing
- Provider consent simulation
- Contact information revelation
- Payment error handling
- Deal creation after successful reveal

#### Deal Management (`deals.spec.ts`)
- Deal listing and status display
- Deal action buttons (confirm, cancel, complete)
- Different deal types (on-chain vs off-chain)
- Navigation to review creation
- Empty state handling

#### Reviews System (`reviews.spec.ts`)
- Reputation score display
- Received vs Given review tabs
- Review listing with ratings
- Badge system display
- Empty state handling

#### Navigation & Routing (`navigation.spec.ts`)
- Authentication-based redirects
- Protected route access
- Inter-page navigation
- Browser back/forward navigation
- Deep linking support
- Logout functionality

## Running Tests

### Prerequisites

1. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

2. Install system dependencies (if possible):
   ```bash
   sudo npx playwright install-deps
   ```

3. Ensure both the Mini App (port 3002) and Mock API (port 3001) are running:
   ```bash
   # Terminal 1: Start Mini App
   pnpm dev

   # Terminal 2: Start Mock API
   cd ../../ && node scripts/mock-api.js
   ```

### Test Commands

```bash
# Run all tests headlessly
pnpm test

# Run tests with browser UI visible
pnpm test:headed

# Run tests with Playwright UI for debugging
pnpm test:ui

# Run tests in debug mode
pnpm test:debug

# Show test report
pnpm test:report

# Run specific test file
pnpm test auth.spec.ts

# Run tests matching a pattern
pnpm test --grep "authentication"
```

### Test Configuration

The tests are configured in `playwright.config.ts` with:

- **Base URL**: `http://localhost:3002` (Mini App)
- **Web Servers**: Automatically starts both Mini App and Mock API
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retry**: 2 times in CI, 0 locally
- **Screenshots**: On failure only
- **Traces**: On first retry

## Mock Data and Simulations

### Authentication Mocking
Tests mock the `window.MiniKit` object to simulate World ID verification:

```typescript
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
```

### User State Persistence
Tests use localStorage to maintain user authentication state:

```typescript
const mockUser = {
  id: 'user_test',
  worldId: 'mock_nullifier_hash',
  verificationLevel: 'orb',
  createdAt: new Date().toISOString(),
};

localStorage.setItem('user', JSON.stringify(mockUser));
localStorage.setItem('isAuthenticated', 'true');
```

### Profile Data Mocking
Different profile types (Provider vs Client) are mocked for testing different user flows:

```typescript
const mockProfile = {
  id: 'profile_test',
  userId: 'user_test',
  type: 'PROVIDER', // or 'CLIENT'
  username: 'test_provider',
  avatarEmoji: '👤',
  bio: 'Test provider bio',
  contactHash: 'mock_contact_hash',
  reputationScore: 4.5,
  totalReviews: 12,
  badges: [],
  createdAt: new Date().toISOString(),
};
```

### API Response Mocking
Tests mock fetch requests to simulate API responses:

```typescript
window.fetch = async (url, options) => {
  if (url.toString().includes('/reviews/')) {
    return {
      ok: true,
      json: async () => ({
        success: true,
        data: { reviews: mockReviews },
      }),
    };
  }
  return originalFetch(url, options);
};
```

## Test Data

### Mock Services
Tests include realistic mock service data:

```typescript
const mockServices = [
  {
    id: 'service_1',
    category: 'construccion',
    title: 'House Repairs & Masonry',
    provider: {
      username: 'maria_constructor',
      avatarEmoji: '👷‍♀️',
      reputationScore: 4.8,
      totalReviews: 47,
    },
    description: 'Professional construction and repair services',
    pricing: { type: 'FIXED', amount: 500 },
  },
];
```

### Mock Deals
Tests simulate different deal statuses and types:

```typescript
const mockDeals = [
  {
    id: 'deal_pending',
    status: 'PENDING',
    onChain: true,
    amount: 500,
    currency: 'USDC',
    escrowTx: '0x1234567890abcdef...',
  },
  {
    id: 'deal_active',
    status: 'ACTIVE',
    onChain: false,
    amount: 200,
    currency: 'USDC',
  },
];
```

### Mock Reviews
Tests include review data with ratings and feedback:

```typescript
const mockReviews = [
  {
    id: 'review_1',
    dealId: 'deal_12345678',
    fromUserId: 'client_1',
    toUserId: 'user_test',
    rating: 5,
    text: 'Excellent work! Very professional and completed the job on time.',
    createdAt: new Date().toISOString(),
  },
];
```

## Test Environment

### Environment Detection
Tests are designed to work with the ngrok-aware functionality:

- When running locally: Uses real API endpoints
- When running through ngrok: Uses mock data fallbacks
- Tests can simulate both scenarios

### MiniKit Integration
Tests thoroughly cover MiniKit integration:

- Detection in World App vs external browser
- Payment processing simulation
- Error handling for unavailable MiniKit
- Different verification scenarios

### Cross-Platform Testing
Tests run on multiple browsers and devices:

- Desktop: Chrome, Firefox, Safari
- Mobile: Chrome (Pixel 5), Safari (iPhone 12)

## Continuous Integration

These tests are designed to run in CI environments with:

- Automatic retry on failure
- Screenshot capture on errors
- Trace collection for debugging
- HTML report generation

## Test Best Practices

1. **Isolation**: Each test is independent and sets up its own mock data
2. **Reliability**: Tests use proper wait conditions and timeouts
3. **Maintainability**: Clear test structure and comprehensive mocking
4. **Coverage**: Tests cover happy paths, error cases, and edge scenarios
5. **Documentation**: Each test file has clear descriptions and comments

## Debugging Tests

### Using Playwright UI
```bash
pnpm test:ui
```

This opens an interactive UI where you can:
- Run individual tests
- See live browser windows
- Step through test execution
- View network requests and console logs

### Debug Mode
```bash
pnpm test:debug
```

This runs tests with the Playwright inspector for detailed debugging.

### Screenshots and Traces
Failed tests automatically capture:
- Screenshots at the point of failure
- Full execution traces for replay
- Network logs and console output

Access these in the HTML report:
```bash
pnpm test:report
```