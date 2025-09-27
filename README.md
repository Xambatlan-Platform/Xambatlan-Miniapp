# Xambatlán 🌟

**Trust-ranking Mini App for World App** - Enabling low-friction deals between service providers and clients through reputation scores, badges, and attestations.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://www.fastify.io/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![World ID](https://img.shields.io/badge/World_ID-000000?style=for-the-badge&logo=worldcoin&logoColor=white)](https://world.org/)

## Overview

Xambatlán is a World App Mini App that creates a trust-ranking layer for service marketplaces. Built with World ID verification, it enables secure deals through:

- **🆔 World ID Authentication** - Sybil-resistant identity verification
- **🔒 Pay-to-Reveal Contacts** - Privacy-preserving contact sharing with consent
- **💰 Escrow Deals** - On-chain and off-chain transaction protection
- **⭐ Reputation System** - EWMA-based scoring with badges and attestations
- **🛡️ Security First** - End-to-end encryption for PII data

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL 13+
- World App mobile app
- ngrok (for local testing)

### 1. Setup

```bash
# Clone and install
git clone <repository-url>
cd Xambatlán
pnpm install

# Run automated setup
./scripts/setup.sh
```

### 2. Start Development

```bash
# Start all services
pnpm dev

# In another terminal, expose for mobile testing
ngrok http 3000
```

### 3. Configure World ID

1. Visit [developer.worldcoin.org](https://developer.worldcoin.org)
2. Create/configure your app with the ngrok URL
3. Update `WORLD_ID_APP_ID` in your environment files
4. Test in World App mobile application

## Project Structure

```
Xambatlán/
├── apps/
│   ├── miniapp/          # Next.js Mini App frontend
│   └── api/              # Fastify API backend
├── packages/
│   ├── contracts/        # Solidity smart contracts
│   ├── types/            # Shared TypeScript types
│   ├── ui/               # Reusable React components
│   └── shared/           # Utilities & encryption
├── scripts/              # Setup and deployment scripts
└── docs/                 # Documentation
```

## Key Features

### 🔐 World ID Authentication
- Sybil-resistant user verification
- JWT-based session management
- Gated profile creation

### 👥 Profile System
- Provider and client profiles
- Encrypted contact information
- Soulbound profile NFTs

### 🛍️ Service Directory
- Categorized service listings
- Availability scheduling
- Price models (hourly/fixed/negotiable)

### 💳 Pay-to-Reveal Contacts
- USDC payment for contact access
- Cryptographic consent signatures
- Time-boxed access tokens
- Complete audit trail

### 🤝 Escrow Deals
- On-chain fund locking
- Mutual confirmation system
- Dispute resolution
- Automated fund release

### ⭐ Reputation Engine
- EWMA algorithm prioritizing recent reviews
- Badge system with automated awards
- On-chain attestations
- Reputation insights and recommendations

## Architecture

### Frontend (Mini App)
- **Framework**: Next.js 15 with App Router
- **UI**: World App Mini Apps UI Kit + TailwindCSS
- **Integration**: MiniKit for World App features
- **State**: React hooks + local state

### Backend (API)
- **Framework**: Fastify with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + World ID verification
- **Security**: Envelope encryption for PII

### Smart Contracts
- **ProfileSBT**: Non-transferable identity tokens
- **Escrow**: Deal management and fund protection
- **ReputationAttestations**: On-chain reputation data

### Security
- **PII Encryption**: Envelope encryption (KEK/DEK)
- **Access Control**: Time-boxed reveal tokens
- **Audit Logging**: Complete action trail
- **Rate Limiting**: API protection

## Development Commands

```bash
# Development
pnpm dev                    # Start all services
pnpm dev:miniapp           # Start Mini App only
pnpm dev:api               # Start API only

# Building
pnpm build                 # Build all packages
pnpm typecheck             # Type check all
pnpm lint                  # Lint all packages

# Database
pnpm db:migrate            # Run migrations
pnpm db:seed               # Seed test data

# Smart Contracts
pnpm contracts:deploy      # Deploy contracts
pnpm contracts:test        # Run contract tests

# Testing
pnpm test                  # Run all tests
```

## Environment Setup

### API (.env)
```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/xambitlan"
JWT_SECRET="your-jwt-secret"
ENCRYPTION_KEY="your-256-bit-hex-key"
WORLD_ID_APP_ID="app_staging_xxx"
WORLD_ID_ACTION="verify-human"
```

### Mini App (.env.local)
```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WORLD_ID_APP_ID="app_staging_xxx"
```

## User Flows

### Provider Registration
1. Open Mini App in World App
2. Complete World ID verification
3. Create provider profile with services
4. Set availability and pricing
5. Receive profile SBT

### Client Deal Flow
1. Browse service directory
2. Pay to reveal provider contact
3. Provider signs consent for reveal
4. Access granted with time-limited token
5. Optional: Create escrow deal
6. Complete work and mutual reviews

### Reputation Building
1. Complete deals successfully
2. Receive positive reviews
3. Earn reputation badges
4. Build trust score over time
5. Attract more clients

## Security Features

- **🔐 End-to-End PII Encryption** using libsodium
- **🔑 Time-Boxed Access Controls** for sensitive data
- **📝 Complete Audit Logging** for compliance
- **🛡️ Rate Limiting** against abuse
- **✅ Cryptographic Signatures** for consent
- **🔒 Soulbound Tokens** preventing identity transfer

## Deployment

### Quick Deploy
```bash
# Deploy everything to staging
./scripts/deploy.sh all staging

# Deploy to production
./scripts/deploy.sh all production
```

### Platform-Specific
- **API**: Railway, Render, or Docker
- **Frontend**: Vercel or Netlify
- **Database**: Railway PostgreSQL, Supabase
- **Contracts**: Ethereum mainnet or World Chain

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Testing

### Local Testing
1. Start development: `pnpm dev`
2. Expose with ngrok: `ngrok http 3000`
3. Update Mini App config with ngrok URL
4. Test in World App mobile application

### Automated Testing
```bash
pnpm test                  # Unit tests
pnpm test:e2e             # End-to-end tests
pnpm test:contracts       # Smart contract tests
```

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Architecture and development guide
- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[API Documentation](./apps/api/openapi.yaml)** - OpenAPI specification

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use Zod for runtime validation
- Write tests for new features
- Update documentation
- Follow security best practices

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS
- **Backend**: Fastify, Prisma, PostgreSQL, JWT
- **Blockchain**: Foundry, Solidity, viem
- **World ID**: MiniKit, World ID SDK
- **Security**: libsodium, HMAC signatures
- **Infrastructure**: Railway, Vercel, IPFS

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Support

- **Documentation**: Check the `/docs` folder
- **Issues**: GitHub Issues
- **World ID**: [World ID Documentation](https://docs.world.org)
- **Community**: [World Developer Discord](https://discord.gg/worldcoin)

---

Built with ❤️ for the World App ecosystem