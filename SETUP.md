# Xambatlán Setup Guide

This guide will help you set up the complete Xambatlán development environment.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** 18+ and **pnpm** 8+
- **PostgreSQL** 13+ (running locally or remote access)
- **Git** for version control
- **ngrok** for local testing with World App
- **World App** mobile app for testing

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd Xambatlán
pnpm install
```

### 2. Database Setup

```bash
# Start PostgreSQL (if using local installation)
brew services start postgresql  # macOS
sudo systemctl start postgresql # Linux
# Or start via Docker
docker run -d --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15

# Create database
createdb xambitlan

# Set up environment variables
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your database connection string
```

### 3. Environment Configuration

Edit `apps/api/.env`:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/xambitlan"

# Generate encryption key
ENCRYPTION_KEY="$(openssl rand -hex 32)"

# Generate JWT secret
JWT_SECRET="$(openssl rand -base64 32)"

# World ID Configuration (get from developer.worldcoin.org)
WORLD_ID_APP_ID="app_staging_xxx"
WORLD_ID_ACTION="verify-human"

# IPFS Configuration (optional for development)
IPFS_PROJECT_ID="your_infura_project_id"
IPFS_PROJECT_SECRET="your_infura_secret"

# Blockchain (use testnets for development)
RPC_URL="https://ethereum-sepolia.publicnode.com"
PRIVATE_KEY="your_testnet_private_key"
```

Edit `apps/miniapp/.env.local`:

```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WORLD_ID_APP_ID="app_staging_xxx"
```

### 4. Initialize Database

```bash
# Run migrations and seed data
pnpm db:migrate
pnpm db:seed
```

### 5. Start Development

```bash
# Start all services
pnpm dev

# Or start individually
pnpm dev:api      # API server on :3001
pnpm dev:miniapp  # Mini App on :3000
```

### 6. Set up ngrok for Testing

```bash
# In a new terminal
ngrok http 3000
```

Update `apps/miniapp/next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  allowedDevOrigins: ['https://your-ngrok-url.ngrok.io'],
  // ... rest of config
};
```

## Detailed Setup Instructions

### World ID App Registration

1. Go to [developer.worldcoin.org](https://developer.worldcoin.org)
2. Create a new app or use existing one
3. Configure the app:
   - **Name**: Xambatlán (or your preferred name)
   - **Environment**: Staging (for development)
   - **Action**: `verify-human`
   - **App URL**: Your ngrok URL (e.g., `https://abc123.ngrok.io`)
4. Copy the App ID to your environment variables

### Database Schema Overview

The application uses the following main tables:

- **users**: World ID authenticated users
- **profiles**: User profiles (provider/client)
- **services**: Service offerings by providers
- **reveal_requests**: Pay-to-reveal contact flow
- **deals**: On-chain and off-chain agreements
- **reviews**: Mutual reviews and ratings
- **badges**: Reputation badges
- **audit_logs**: Security audit trail

### Smart Contract Deployment (Optional)

For full functionality, deploy the smart contracts:

```bash
cd packages/contracts

# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Compile contracts
forge build

# Run tests
forge test

# Deploy to testnet (update .env with your keys)
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --verify
```

### IPFS Configuration

For metadata storage, you can use:

1. **Infura IPFS** (recommended for development):
   - Sign up at infura.io
   - Create an IPFS project
   - Add credentials to environment variables

2. **Local IPFS node**:
   ```bash
   # Install IPFS
   brew install ipfs  # macOS

   # Initialize and start
   ipfs init
   ipfs daemon
   ```

## Testing the Setup

### 1. API Health Check

```bash
curl http://localhost:3001/health
# Should return: {"status":"healthy","timestamp":"..."}
```

### 2. Database Connection

```bash
pnpm --filter api prisma studio
# Opens Prisma Studio at http://localhost:5555
```

### 3. Frontend Access

- Local: http://localhost:3000
- ngrok: https://your-subdomain.ngrok.io

### 4. Test World ID Integration

1. Open the ngrok URL in World App
2. The app should prompt for World ID verification
3. Complete verification to test the flow

## Development Workflow

### Making Changes

1. **Frontend changes**: Edit files in `apps/miniapp/`
2. **Backend changes**: Edit files in `apps/api/`
3. **Shared code**: Edit files in `packages/`
4. **Database changes**: Create new Prisma migration:
   ```bash
   pnpm --filter api prisma migrate dev --name your-change-name
   ```

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific workspace tests
pnpm --filter api test
pnpm --filter contracts test
```

### Code Quality

```bash
# Lint all code
pnpm lint

# Type check
pnpm typecheck

# Format code
pnpm --filter miniapp format
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

```bash
# Check PostgreSQL status
pg_isready

# Check connection string
psql $DATABASE_URL

# Reset database if needed
dropdb xambitlan && createdb xambitlan
pnpm db:migrate
pnpm db:seed
```

#### 2. World ID Verification Fails

- Verify App ID matches between environment and developer portal
- Check that ngrok URL is configured in World ID app settings
- Ensure action name is exactly `verify-human`

#### 3. MiniKit Connection Issues

- Confirm `allowedDevOrigins` includes your ngrok URL
- Check browser console for CORS errors
- Restart ngrok and update URL if needed

#### 4. Package Installation Issues

```bash
# Clear all node_modules and reinstall
rm -rf node_modules packages/*/node_modules apps/*/node_modules
pnpm install
```

#### 5. Build Errors

```bash
# Clean and rebuild all packages
pnpm clean
pnpm build
```

### Debugging Tips

1. **Enable debug logging**:
   ```bash
   export DEBUG=xambitlan:*
   pnpm dev:api
   ```

2. **Check API logs**: The Fastify server logs all requests and responses

3. **Use Prisma Studio**: Great for inspecting database state

4. **Browser DevTools**: Essential for frontend debugging

5. **ngrok Inspector**: Visit http://localhost:4040 to see all requests

## Environment Variables Reference

### API Server (`apps/api/.env`)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@localhost:5432/xambitlan` |
| `JWT_SECRET` | Secret for signing JWT tokens | Yes | `your-secret-key` |
| `ENCRYPTION_KEY` | 256-bit key for PII encryption | Yes | `openssl rand -hex 32` |
| `WORLD_ID_APP_ID` | App ID from World ID developer portal | Yes | `app_staging_xxx` |
| `WORLD_ID_ACTION` | Action identifier for verification | Yes | `verify-human` |
| `IPFS_PROJECT_ID` | Infura IPFS project ID | No | `your-project-id` |
| `IPFS_PROJECT_SECRET` | Infura IPFS secret | No | `your-secret` |
| `RPC_URL` | Ethereum RPC endpoint | No | `https://ethereum-sepolia.publicnode.com` |
| `PRIVATE_KEY` | Private key for contract deployment | No | `0x...` |

### Mini App (`apps/miniapp/.env.local`)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | API server URL | Yes | `http://localhost:3001` |
| `NEXT_PUBLIC_WORLD_ID_APP_ID` | World ID app ID (public) | Yes | `app_staging_xxx` |

## Next Steps

Once you have the basic setup working:

1. **Customize the app**: Update branding, colors, and content
2. **Add services**: Use the seeded provider accounts to create test services
3. **Test flows**: Try the complete user journey from verification to deal completion
4. **Deploy**: Follow the deployment guide for production setup

## Getting Help

- Check the main [CLAUDE.md](./CLAUDE.md) for detailed architecture information
- Review the [API documentation](./apps/api/openapi.yaml)
- Check existing issues and tests for usage examples
- For World ID specific issues, see [World ID docs](https://docs.world.org)