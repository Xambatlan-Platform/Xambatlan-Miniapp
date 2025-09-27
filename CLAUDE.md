# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Xambatlán** is a World App Mini App featuring a trust-ranking (reputation) layer for service providers and clients. It enables low-friction deals through reputation scores, badges, and attestations using World ID verification.

This is a **monorepo** built with:
- **Frontend**: Next.js 15 + React 19 + TypeScript + MiniKit
- **Backend**: Fastify + TypeScript + Prisma + PostgreSQL
- **Contracts**: Foundry (Solidity) with mock implementations
- **Shared**: TypeScript packages for types, utilities, and encryption

## Development Commands

```bash
# Root commands (run all workspaces)
pnpm dev                    # Start all services in development
pnpm build                  # Build all packages
pnpm test                   # Run all tests
pnpm lint                   # Lint all packages
pnpm typecheck             # Type check all packages

# Individual workspace commands
pnpm dev:miniapp           # Start Mini App (port 3000)
pnpm dev:api               # Start API server (port 3001)
pnpm build:miniapp         # Build Mini App
pnpm build:api             # Build API server

# Database commands
pnpm db:migrate            # Run Prisma migrations
pnpm db:seed               # Seed database with test data

# Smart contract commands
pnpm contracts:deploy      # Deploy contracts to testnet
pnpm contracts:test        # Run contract tests

# Setup commands
cp apps/api/.env.example apps/api/.env  # Copy API environment template
ngrok http 3000                         # Expose local server for testing
```

## Monorepo Structure

```
apps/
  miniapp/          # Next.js Mini App frontend
  api/              # Fastify API backend
packages/
  contracts/        # Solidity smart contracts (Foundry)
  types/            # Shared TypeScript types and schemas
  ui/               # Shared React components
  shared/           # Utilities (encryption, IPFS, validation)
```

## Architecture

### Frontend (Mini App) - `apps/miniapp/`
- **Framework**: Next.js 15 with App Router
- **Authentication**: World ID verification via MiniKit
- **UI**: World App Mini Apps UI Kit + TailwindCSS
- **State**: React hooks + local state management
- **Key Features**: Profile management, service directory, pay-to-reveal, escrow deals

### Backend (API) - `apps/api/`
- **Framework**: Fastify with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with World ID verification
- **Security**: Envelope encryption for PII, audit logging
- **Key Features**: REST API, World ID verification, escrow webhooks

### Smart Contracts - `packages/contracts/`
- **Framework**: Foundry
- **Contracts**: ProfileSBT (non-transferable), Escrow, ReputationAttestations
- **Network**: Testnet deployment (mock for development)
- **Integration**: viem for contract interactions via MiniKit

### Shared Packages
- **`@xambitlan/types`**: Zod schemas, TypeScript types, API contracts
- **`@xambitlan/shared`**: Encryption utilities, IPFS helpers, reputation engine
- **`@xambitlan/ui`**: Reusable React components

## Key Features Implementation

### World ID Authentication Flow
1. User opens Mini App in World App
2. `MiniKit.verify()` called with action `verify-human`
3. Backend verifies proof via World ID cloud verification
4. JWT token issued for authenticated sessions
5. Profile creation gated behind verification

### Pay-to-Reveal Contact Flow
1. Client pays fee via `MiniKit.pay()` to reveal provider contact
2. Provider receives notification and signs consent via `MiniKit.signTypedData()`
3. Backend validates payment + consent, decrypts contact info
4. Time-boxed access token generated for client
5. Audit trail logged for all actions

### On-Chain Escrow Deals
1. Client locks funds via `MiniKit.sendTransaction()` to Escrow contract
2. Both parties confirm completion on-chain
3. Funds released to provider automatically
4. Review system triggered post-completion

### Reputation System
- EWMA algorithm prioritizes recent reviews
- On-chain attestations for verified reviews
- Badge system based on performance metrics
- Soulbound profile NFTs store reputation metadata

## Environment Configuration

### API (.env)
```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/xambitlan"

# Authentication & Security
JWT_SECRET="your-jwt-secret"
ENCRYPTION_KEY="your-256-bit-hex-key"  # openssl rand -hex 32

# World ID
WORLD_ID_APP_ID="app_staging_xxx"
WORLD_ID_ACTION="verify-human"

# IPFS (Infura)
IPFS_PROJECT_ID="your_project_id"
IPFS_PROJECT_SECRET="your_secret"

# Blockchain
RPC_URL="https://ethereum-sepolia.publicnode.com"
PRIVATE_KEY="your_deployment_key"
```

### Mini App (.env.local)
```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WORLD_ID_APP_ID="app_staging_xxx"
```

## Database Schema

Key models in Prisma schema:
- **User**: World ID hash, timestamps
- **Profile**: Username, bio, encrypted contact, reputation score
- **Service**: Category, title, description, pricing, availability
- **RevealRequest**: Pay-to-reveal flow tracking
- **Deal**: On-chain/off-chain deal management
- **Review**: Mutual reviews with ratings
- **Badge**: Reputation badges
- **AuditLog**: Security audit trail

## Security Implementation

### PII Protection
- Contact info encrypted with envelope encryption (KEK/DEK)
- Public hash for verification without revealing content
- Time-boxed access tokens for reveal requests
- Audit logging for all sensitive operations

### Access Control
- JWT-based authentication with World ID verification
- Role-based permissions (provider, client, admin)
- Rate limiting on sensitive endpoints
- CORS properly configured for Mini App

## Testing Strategy

### Manual Testing with ngrok
1. Start development servers: `pnpm dev`
2. Expose via ngrok: `ngrok http 3000`
3. Update `allowedDevOrigins` in `next.config.ts`
4. Configure app URL in World ID developer portal
5. Test in World App mobile application

### Database Testing
- Seed script creates mock users with different profiles
- Test data includes services, reviews, and reputation scores
- Reset with: `pnpm db:migrate --name reset && pnpm db:seed`

## Deployment Notes

### Prerequisites
- PostgreSQL database
- IPFS node or Infura account
- World ID app registration
- Testnet funds for contract deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Smart contracts deployed
- [ ] IPFS storage configured
- [ ] World ID production app registered
- [ ] Rate limiting configured
- [ ] Monitoring and logging set up

## Development Workflow

1. **Start Development**: `pnpm dev` (starts all services)
2. **Make Changes**: Edit files in appropriate workspace
3. **Test Locally**: Use ngrok to test in World App
4. **Run Tests**: `pnpm test` before committing
5. **Deploy**: Use deployment scripts in respective workspaces

## Troubleshooting

### Common Issues
- **MiniKit not connected**: Check app ID and allowed origins
- **Database connection**: Verify PostgreSQL is running and DATABASE_URL is correct
- **World ID verification fails**: Check action and app_id match registration
- **IPFS upload fails**: Verify credentials and network connectivity
- **Contract interactions fail**: Check RPC URL and contract addresses