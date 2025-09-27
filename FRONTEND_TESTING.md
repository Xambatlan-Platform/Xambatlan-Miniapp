# Frontend Testing Guide

This guide explains how to test the Xambatlán frontend using mock services, without requiring real databases or deployed smart contracts.

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Testing Environment
```bash
# Option 1: Use the automated test script
pnpm test:frontend

# Option 2: Manual setup
# Terminal 1: Start mock API
node scripts/mock-api.js

# Terminal 2: Start Mini App
cd apps/miniapp && pnpm dev
```

### 3. Test in World App
1. Open World App on your mobile device
2. Navigate to: `https://evidently-uncompensating-neal.ngrok-free.dev/`
3. Test the World ID verification flow

## What's Included

### ✅ Mock API Server
- **Port**: 3001
- **Endpoints**: All planned API endpoints with fake data
- **Features**:
  - World ID verification simulation
  - Profile management
  - Service directory
  - Pay-to-reveal flow
  - Deal management
  - Review system

### ✅ Frontend Components
- **World ID Integration**: MiniKit.verify() with your app ID
- **Responsive Design**: Mobile-optimized for World App
- **Error Handling**: Clear feedback for all states
- **Debug Info**: Console logging for development

### ✅ Configuration
- **App ID**: `app_myXambita0` (configured)
- **Ngrok URL**: `https://evidently-uncompensating-neal.ngrok-free.dev/` (configured)
- **API URL**: `http://localhost:3001` (mock API)

## Testing Scenarios

### 1. World ID Verification ✅
**What it tests**: MiniKit integration with World ID
**Steps**:
1. Open app in World App
2. Tap "Verify with World ID"
3. Complete World ID verification flow
4. Check console for debug information

**Expected Results**:
- MiniKit.verify() called with correct parameters
- Proof sent to mock API
- Success state displayed
- Console shows verification flow

### 2. Mock API Integration ✅
**What it tests**: API communication without real backend
**Endpoints Available**:
- `POST /auth/verify` - Simulates World ID verification
- `GET /profiles/me` - Returns mock user profile
- `POST /profiles` - Creates new mock profile
- `GET /services` - Returns mock service listings
- `POST /services` - Creates new mock service
- `GET /categories` - Returns service categories

**Test Method**:
1. Open browser dev tools
2. Watch Network tab during interactions
3. Verify API calls are made correctly

### 3. Profile System (Ready for Testing)
**Mock Data Available**:
- Provider profiles with ratings and badges
- Client profiles
- Profile creation flow
- Contact information (encrypted)

### 4. Service Directory (Ready for Testing)
**Mock Data Available**:
- Construction services
- Technology services
- Cleaning services
- Categories with icons and descriptions

### 5. Pay-to-Reveal Flow (Ready for Testing)
**Mock Endpoints**:
- Request contact reveal
- Provider consent simulation
- Contact information access
- Time-boxed tokens

### 6. Reputation System (Ready for Testing)
**Mock Data Available**:
- Reviews and ratings
- Reputation scores
- Badge system
- Rating distributions

## Development Features

### Console Debugging
All interactions log detailed information:
```javascript
🔍 Starting World ID verification...
✅ World ID verification result: {...}
📡 API verification result: {...}
🎉 Authentication successful!
```

### Error Handling
- Network errors
- MiniKit availability
- World ID verification failures
- API response errors

### State Management
- Loading states
- Success/error feedback
- Test reset functionality

## Mock API Details

### Available Data
```javascript
// Mock users with different profiles
- maria_constructor (Provider, 4.8★, 47 reviews)
- carlos_tech (Provider, 4.9★, 23 reviews)
- ana_client (Client, 4.5★, 8 reviews)

// Mock services
- House Repairs & Masonry ($25/hour)
- Web Development & IT Support ($500 fixed)

// Mock categories
- Construction & Building 🏗️
- Technology & IT 💻
- Cleaning Services 🧹
- Gardening & Landscaping 🌱
```

### Response Format
All endpoints return consistent structure:
```json
{
  "success": true,
  "data": {...},
  "error": "Error message if failed"
}
```

## Troubleshooting

### Common Issues

#### 1. MiniKit Not Detected
**Problem**: "MiniKit not detected" message
**Solution**:
- Ensure you're opening the app in World App mobile
- Check that the ngrok URL is correct
- Verify allowedDevOrigins in next.config.ts

#### 2. API Calls Failing
**Problem**: Network errors in console
**Solution**:
- Check mock API is running on port 3001
- Verify NEXT_PUBLIC_API_URL environment variable
- Check CORS settings

#### 3. World ID Verification Issues
**Problem**: Verification fails or hangs
**Solution**:
- Confirm app ID matches World ID developer portal
- Check action name is "verify-human"
- Verify app is configured for staging environment

#### 4. Build Errors
**Problem**: TypeScript or build errors
**Solution**:
```bash
# Clean install
rm -rf node_modules
pnpm install

# Check configuration
pnpm typecheck
```

### Debug Steps

1. **Check Services**:
   ```bash
   # Verify mock API
   curl http://localhost:3001/health

   # Check Mini App
   curl http://localhost:3000
   ```

2. **Console Logging**:
   - Open browser dev tools
   - Check Console tab for debug messages
   - Look for MiniKit and API call logs

3. **Network Inspection**:
   - Open Network tab in dev tools
   - Monitor API calls during testing
   - Verify request/response format

## Next Steps

### When Ready for Real Implementation

1. **Replace Mock API**:
   - Implement real Fastify backend
   - Connect to PostgreSQL database
   - Deploy smart contracts

2. **Update Configuration**:
   - Switch to production World ID app
   - Configure real API endpoints
   - Update environment variables

3. **Add Features**:
   - Complete UI components
   - Implement missing flows
   - Add proper error handling

### Testing Checklist

- [ ] World ID verification works
- [ ] Mock API responds correctly
- [ ] Console shows debug information
- [ ] App loads in World App mobile
- [ ] Network requests are successful
- [ ] Error states display properly
- [ ] Success states display properly

## Environment Files

### apps/miniapp/.env.local
```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WORLD_ID_APP_ID="app_myXambita0"
```

### Configuration Files
- `next.config.ts`: Ngrok domain configured
- `package.json`: Test script added
- Mock API: Comprehensive endpoints

## Support

If you encounter issues:

1. Check this documentation first
2. Verify all environment variables
3. Ensure services are running on correct ports
4. Check browser console for errors
5. Test API endpoints directly with curl

The testing environment is designed to be self-contained and work without external dependencies, making it perfect for frontend development and testing.