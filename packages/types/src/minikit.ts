import { z } from 'zod';

// MiniKit Command Types
export const MiniKitCommandSchema = z.enum([
  'verify',
  'pay',
  'sendTransaction',
  'signMessage',
  'signTypedData',
]);

export type MiniKitCommand = z.infer<typeof MiniKitCommandSchema>;

// Verify Command
export const VerifyCommandPayloadSchema = z.object({
  action: z.string(),
  signal: z.string().optional(),
  verification_level: z.enum(['orb', 'device']).default('orb'),
});

export type VerifyCommandPayload = z.infer<typeof VerifyCommandPayloadSchema>;

export const VerifyResponseSchema = z.object({
  proof: z.string(),
  nullifier_hash: z.string(),
  merkle_root: z.string(),
  verification_level: z.enum(['orb', 'device']),
  action: z.string(),
  signal: z.string(),
});

export type VerifyResponse = z.infer<typeof VerifyResponseSchema>;

// Pay Command
export const PayCommandPayloadSchema = z.object({
  to: z.string(),
  tokens: z.array(z.object({
    symbol: z.string(),
    token_amount: z.string(),
  })),
  description: z.string().optional(),
  reference: z.string().optional(),
});

export type PayCommandPayload = z.infer<typeof PayCommandPayloadSchema>;

export const PayResponseSchema = z.object({
  transaction_id: z.string(),
  status: z.enum(['pending', 'confirmed', 'failed']),
});

export type PayResponse = z.infer<typeof PayResponseSchema>;

// Send Transaction Command
export const SendTransactionPayloadSchema = z.object({
  to: z.string(),
  data: z.string(),
  value: z.string().optional(),
});

export type SendTransactionPayload = z.infer<typeof SendTransactionPayloadSchema>;

export const SendTransactionResponseSchema = z.object({
  transaction_id: z.string(),
  status: z.enum(['pending', 'confirmed', 'failed']),
});

export type SendTransactionResponse = z.infer<typeof SendTransactionResponseSchema>;

// Sign Message Command
export const SignMessagePayloadSchema = z.object({
  message: z.string(),
});

export type SignMessagePayload = z.infer<typeof SignMessagePayloadSchema>;

export const SignMessageResponseSchema = z.object({
  signature: z.string(),
  address: z.string(),
});

export type SignMessageResponse = z.infer<typeof SignMessageResponseSchema>;

// Sign Typed Data Command
export const SignTypedDataPayloadSchema = z.object({
  domain: z.object({
    name: z.string(),
    version: z.string(),
    chainId: z.number(),
    verifyingContract: z.string().optional(),
  }),
  types: z.record(z.array(z.object({
    name: z.string(),
    type: z.string(),
  }))),
  primaryType: z.string(),
  message: z.record(z.unknown()),
});

export type SignTypedDataPayload = z.infer<typeof SignTypedDataPayloadSchema>;

export const SignTypedDataResponseSchema = z.object({
  signature: z.string(),
  address: z.string(),
});

export type SignTypedDataResponse = z.infer<typeof SignTypedDataResponseSchema>;

// MiniKit Errors
export const MiniKitErrorSchema = z.object({
  code: z.enum([
    'user_cancelled',
    'invalid_payload',
    'transaction_failed',
    'insufficient_funds',
    'network_error',
    'verification_failed',
    'signature_failed',
  ]),
  message: z.string(),
});

export type MiniKitError = z.infer<typeof MiniKitErrorSchema>;

// MiniKit Response Wrapper
export const MiniKitResponseSchema = <T extends z.ZodType>(dataSchema: T) => z.union([
  z.object({
    success: z.literal(true),
    data: dataSchema,
  }),
  z.object({
    success: z.literal(false),
    error: MiniKitErrorSchema,
  }),
]);

export type MiniKitResponse<T> =
  | { success: true; data: T }
  | { success: false; error: MiniKitError };

// App Configuration
export const MiniKitConfigSchema = z.object({
  app_id: z.string(),
  debug: z.boolean().default(false),
  enable_telemetry: z.boolean().default(true),
});

export type MiniKitConfig = z.infer<typeof MiniKitConfigSchema>;

// User Info (from MiniKit.getUserInfo)
export const UserInfoSchema = z.object({
  walletAddress: z.string(),
  username: z.string().optional(),
  profilePictureUrl: z.string().url().optional(),
});

export type UserInfo = z.infer<typeof UserInfoSchema>;

// App Permissions
export const AppPermissionSchema = z.enum([
  'read_profile',
  'read_contacts',
  'send_transactions',
  'sign_messages',
  'verify_identity',
]);

export type AppPermission = z.infer<typeof AppPermissionSchema>;

// Command Status
export const CommandStatusSchema = z.enum([
  'idle',
  'pending',
  'success',
  'error',
]);

export type CommandStatus = z.infer<typeof CommandStatusSchema>;

// Hooks for React
export interface UseMiniKitState {
  isInstalled: boolean;
  isConnected: boolean;
  userInfo?: UserInfo;
  commandStatus: CommandStatus;
  lastError?: MiniKitError;
}

// Payment Token Configuration
export const PaymentTokenSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
  address: z.string(),
  iconUrl: z.string().url().optional(),
});

export type PaymentToken = z.infer<typeof PaymentTokenSchema>;

// Common token configurations
export const SUPPORTED_TOKENS: Record<string, PaymentToken> = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia USDC
  },
  WLD: {
    symbol: 'WLD',
    name: 'Worldcoin',
    decimals: 18,
    address: '0x2cFc85d8E48F8EAB294be644d9E25C3030863003', // Sepolia WLD
  },
};

// Transaction Receipts
export const TransactionReceiptSchema = z.object({
  transactionHash: z.string(),
  blockNumber: z.number(),
  gasUsed: z.string(),
  status: z.enum(['success', 'reverted']),
  logs: z.array(z.object({
    address: z.string(),
    topics: z.array(z.string()),
    data: z.string(),
  })),
});

export type TransactionReceipt = z.infer<typeof TransactionReceiptSchema>;