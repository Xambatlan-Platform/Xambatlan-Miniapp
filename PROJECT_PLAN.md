# Xambatlán MVP Project Plan

## Project Overview
**Xambatlán** is a World App Mini App featuring a trust-ranking (reputation) layer for service providers and clients. Core value: enabling low-friction deals through reputation scores, badges, and attestations.

## Milestones & Timeline

### Phase 1: Foundation & Setup (Days 1-2)
**Milestone**: Project scaffolding and basic infrastructure

#### Tasks:
- [ ] Set up monorepo with pnpm workspaces
- [ ] Configure Next.js Mini App with MiniKit-JS
- [ ] Set up Fastify API server with TypeScript
- [ ] Configure Prisma with PostgreSQL
- [ ] Set up Foundry for smart contracts
- [ ] Create shared types and utilities packages

**Acceptance Criteria**:
- All workspaces can be built and run locally
- MiniKit verify command works in development
- Database connection established
- Basic project structure documented

### Phase 2: Authentication & Profiles (Days 3-4)
**Milestone**: World ID authentication and profile management

#### Tasks:
- [ ] Implement World ID verification flow
- [ ] Create user registration with profile creation
- [ ] Build profile management UI (provider/client types)
- [ ] Implement avatar upload/emoji selection
- [ ] Set up IPFS integration for metadata
- [ ] Create mock ProfileSBT contract

**Acceptance Criteria**:
- Users can authenticate with World ID
- Profile creation and editing works
- Contact data is properly encrypted
- SBT minting flow simulated

### Phase 3: Service Directory (Days 5-6)
**Milestone**: Service listing and discovery

#### Tasks:
- [ ] Build service creation form
- [ ] Implement category filtering (oficios/professional)
- [ ] Create service listing/directory page
- [ ] Add search and filter functionality
- [ ] Implement availability scheduling
- [ ] Store service metadata on IPFS

**Acceptance Criteria**:
- Providers can create and manage services
- Clients can browse and filter services
- Services display correctly with metadata
- Availability windows work properly

### Phase 4: Pay-to-Reveal + Consent (Days 7-8)
**Milestone**: Contact revelation with payment and consent

#### Tasks:
- [ ] Implement MiniKit pay integration
- [ ] Create reveal request system
- [ ] Build provider consent flow with signTypedData
- [ ] Implement contact decryption and time-boxed access
- [ ] Create audit logging for all reveal actions
- [ ] Add notification system for consent requests

**Acceptance Criteria**:
- Payment flow works with testnet USDC
- Provider consent mechanism functions
- Contact data is securely revealed
- All actions are properly audited
- Time-boxed access expires correctly

### Phase 5: Escrow & Deals (Days 9-10)
**Milestone**: On-chain and off-chain deal management

#### Tasks:
- [ ] Create mock Escrow smart contract
- [ ] Implement deal creation (on-chain/off-chain)
- [ ] Build escrow fund locking mechanism
- [ ] Create deal completion flow
- [ ] Add dispute resolution basics
- [ ] Implement deal status tracking

**Acceptance Criteria**:
- Users can create deals with escrow
- Funds can be locked and released
- Off-chain agreements work
- Deal statuses update correctly
- Basic dispute handling exists

### Phase 6: Reputation System (Days 11-12)
**Milestone**: Reviews and reputation scoring

#### Tasks:
- [ ] Build mutual review system
- [ ] Implement reputation algorithm (EWMA)
- [ ] Create badge system
- [ ] Add attestation integration
- [ ] Build reputation display components
- [ ] Create reputation history tracking

**Acceptance Criteria**:
- Mutual reviews work after deal completion
- Reputation scores calculate correctly
- Badges are awarded appropriately
- Reputation history is visible
- No PII leaks in reputation data

### Phase 7: Testing & Polish (Days 13-14)
**Milestone**: E2E testing and final polish

#### Tasks:
- [ ] Create comprehensive E2E tests
- [ ] Test complete user flows
- [ ] Add error handling and edge cases
- [ ] Optimize performance
- [ ] Create deployment documentation
- [ ] Final security review

**Acceptance Criteria**:
- All E2E tests pass
- Error handling is robust
- Performance is acceptable
- Documentation is complete
- Security audit completed

## Technical Architecture

### Frontend (Mini App)
- **Framework**: Next.js 15 + TypeScript
- **UI**: World App Mini Apps UI Kit + TailwindCSS
- **Integration**: @worldcoin/minikit-js for World App features
- **Storage**: Local state + API calls

### Backend (API)
- **Framework**: Fastify + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: World ID cloud verification
- **Encryption**: libsodium for PII protection
- **File Storage**: IPFS for metadata

### Smart Contracts (Mock)
- **Framework**: Foundry
- **Contracts**: ProfileSBT, Escrow, ReputationAttestations
- **Network**: Testnet (World Chain or Ethereum testnets)
- **Integration**: viem for contract interactions

### Security & Privacy
- **PII Encryption**: Envelope encryption (KEK/DEK)
- **Audit Logging**: All sensitive actions logged
- **Access Control**: Time-boxed tokens for reveal
- **Consent**: Cryptographic signatures required

## Risk Mitigation

### Technical Risks
- **MiniKit Integration**: Start with basic commands, expand gradually
- **Encryption Complexity**: Use well-tested libraries (libsodium)
- **IPFS Reliability**: Have fallback storage options
- **Smart Contract Security**: Use established patterns, extensive testing

### Product Risks
- **User Adoption**: Focus on core value prop (trust/reputation)
- **Privacy Concerns**: Be transparent about data handling
- **Regulatory**: Avoid KYC requirements in MVP
- **Scalability**: Design for future optimization

## Success Metrics

### MVP Success Criteria
- [ ] Complete user registration flow works
- [ ] Service listing and discovery functional
- [ ] Pay-to-reveal with consent operates correctly
- [ ] Basic escrow deals can be completed
- [ ] Reputation scores update after reviews
- [ ] All critical paths tested end-to-end

### Performance Targets
- Page load times < 2s on mobile
- API response times < 500ms
- Database queries optimized
- IPFS metadata retrieval < 5s

### Security Requirements
- No PII stored unencrypted
- All reveal actions audited
- Consent signatures verified
- Time-based access controls enforced

## Next Steps
1. Execute Phase 1 tasks
2. Set up development environment
3. Begin implementation following this plan
4. Regular progress reviews and adjustments as needed