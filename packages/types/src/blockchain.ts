import { z } from 'zod';
import type { Address, Hash } from 'viem';

// Contract Addresses
export interface ContractAddresses {
  ProfileSBT: Address;
  Escrow: Address;
  ReputationAttestations: Address;
}

// Transaction Types
export const TransactionStatusSchema = z.enum(['pending', 'confirmed', 'failed']);
export type TransactionStatus = z.infer<typeof TransactionStatusSchema>;

export interface TransactionDetails {
  hash: Hash;
  status: TransactionStatus;
  blockNumber?: bigint;
  gasUsed?: bigint;
  effectiveGasPrice?: bigint;
}

// Profile SBT Types
export interface ProfileSBTMintParams {
  to: Address;
  profileHash: Hash;
}

export interface ProfileSBTUpdateParams {
  tokenId: bigint;
  newHash: Hash;
}

// Escrow Types
export interface EscrowCreateParams {
  dealId: Hash;
  provider: Address;
  token: Address;
  amount: bigint;
  expiry: bigint;
}

export interface EscrowDeal {
  id: Hash;
  client: Address;
  provider: Address;
  token: Address;
  amount: bigint;
  expiry: bigint;
  status: 0 | 1 | 2 | 3; // ACTIVE, COMPLETED, CANCELLED, DISPUTED
  clientConfirmed: boolean;
  providerConfirmed: boolean;
  createdAt: bigint;
}

// Reputation Attestation Types
export interface ReputationAttestationParams {
  attestationId: Hash;
  to: Address;
  rating: number;
  dealId: Hash;
  ipfsHash: string;
}

export interface ReputationAttestation {
  id: Hash;
  from: Address;
  to: Address;
  rating: number;
  dealId: Hash;
  ipfsHash: string;
  timestamp: bigint;
  verified: boolean;
}

export interface UserReputation {
  totalReviews: bigint;
  totalRating: bigint;
  lastUpdated: bigint;
  exists: boolean;
}

// MiniKit Transaction Types
export const MiniKitTransactionSchema = z.object({
  to: z.string(),
  data: z.string(),
  value: z.string().optional(),
  gas: z.string().optional(),
  gasPrice: z.string().optional(),
});

export type MiniKitTransaction = z.infer<typeof MiniKitTransactionSchema>;

// Payment Types
export const PaymentSchema = z.object({
  to: z.string(),
  amount: z.string(),
  token: z.string().default('USDC'),
  description: z.string().optional(),
});

export type Payment = z.infer<typeof PaymentSchema>;

// Blockchain Configuration
export interface ChainConfig {
  id: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  contracts: ContractAddresses;
  tokens: {
    USDC: Address;
    WETH?: Address;
  };
}

// Event Types
export interface ContractEvent {
  address: Address;
  blockNumber: bigint;
  transactionHash: Hash;
  logIndex: number;
  removed: boolean;
}

export interface ProfileMintedEvent extends ContractEvent {
  to: Address;
  tokenId: bigint;
  profileHash: Hash;
}

export interface DealCreatedEvent extends ContractEvent {
  dealId: Hash;
  client: Address;
  provider: Address;
  token: Address;
  amount: bigint;
  expiry: bigint;
}

export interface ReviewAttestedEvent extends ContractEvent {
  attestationId: Hash;
  from: Address;
  to: Address;
  rating: number;
  dealId: Hash;
}

// Typed Data for Signatures
export const ConsentTypedDataSchema = z.object({
  domain: z.object({
    name: z.string(),
    version: z.string(),
    chainId: z.number(),
    verifyingContract: z.string(),
  }),
  types: z.object({
    Consent: z.array(z.object({
      name: z.string(),
      type: z.string(),
    })),
  }),
  primaryType: z.literal('Consent'),
  message: z.object({
    requestId: z.string(),
    clientAddress: z.string(),
    serviceId: z.string(),
    timestamp: z.number(),
    consent: z.boolean(),
  }),
});

export type ConsentTypedData = z.infer<typeof ConsentTypedDataSchema>;

// IPFS Types
export interface IPFSMetadata {
  version: string;
  name: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties?: Record<string, any>;
}

export interface ProfileMetadata extends IPFSMetadata {
  type: 'profile';
  profileType: 'PROVIDER' | 'CLIENT';
  username: string;
  bio?: string;
  categories?: string[];
  location?: {
    region: string;
    timezone: string;
  };
}

export interface ServiceMetadata extends IPFSMetadata {
  type: 'service';
  category: string;
  title: string;
  description: string;
  priceModel: string;
  tags?: string[];
  requirements?: string[];
}

// Gas Estimation
export interface GasEstimate {
  gasLimit: bigint;
  gasPrice: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
  estimatedCost: bigint;
}

// Error Types
export const BlockchainErrorSchema = z.object({
  code: z.enum([
    'TRANSACTION_FAILED',
    'INSUFFICIENT_FUNDS',
    'CONTRACT_ERROR',
    'NETWORK_ERROR',
    'USER_REJECTED',
    'INVALID_SIGNATURE',
  ]),
  message: z.string(),
  txHash: z.string().optional(),
});

export type BlockchainError = z.infer<typeof BlockchainErrorSchema>;