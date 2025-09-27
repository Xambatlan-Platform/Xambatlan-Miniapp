import { z } from 'zod';

// World ID Verification
export const WorldIdProofSchema = z.object({
  proof: z.string(),
  nullifier_hash: z.string(),
  merkle_root: z.string(),
  verification_level: z.enum(['orb', 'device']),
  action: z.string(),
  signal: z.string(),
});

export type WorldIdProof = z.infer<typeof WorldIdProofSchema>;

export const VerifyProofRequestSchema = WorldIdProofSchema;
export type VerifyProofRequest = z.infer<typeof VerifyProofRequestSchema>;

// JWT & Authentication
export interface JwtPayload {
  userId: string;
  worldIdHash: string;
  iat: number;
  exp: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    worldIdHash: string;
    createdAt: string;
  };
  profile?: {
    id: string;
    type: 'PROVIDER' | 'CLIENT';
    username: string;
    avatarUrl?: string;
    avatarEmoji?: string;
    reputationScore: number;
  };
  isNewUser: boolean;
}

// Session Management
export interface SessionUser {
  id: string;
  worldIdHash: string;
  profile?: {
    id: string;
    type: 'PROVIDER' | 'CLIENT';
    username: string;
    avatarUrl?: string;
    avatarEmoji?: string;
    reputationScore: number;
  };
}

// Request Context
export interface AuthenticatedRequest {
  user: SessionUser;
  token: string;
}

// Permissions
export type Permission =
  | 'profile:read'
  | 'profile:write'
  | 'service:read'
  | 'service:write'
  | 'service:delete'
  | 'reveal:request'
  | 'reveal:consent'
  | 'deal:create'
  | 'deal:manage'
  | 'review:create'
  | 'admin:all';

export interface Role {
  name: string;
  permissions: Permission[];
}

// Auth Errors
export const AuthErrorSchema = z.object({
  code: z.enum([
    'INVALID_TOKEN',
    'TOKEN_EXPIRED',
    'VERIFICATION_FAILED',
    'INSUFFICIENT_PERMISSIONS',
    'USER_NOT_FOUND',
    'PROFILE_NOT_FOUND',
  ]),
  message: z.string(),
});

export type AuthError = z.infer<typeof AuthErrorSchema>;