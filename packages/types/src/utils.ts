import { z } from 'zod';

// Common utility types
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Date utilities
export const DateTimeSchema = z.string().datetime();
export const DateSchema = z.string().date();

// ID types
export const CuidSchema = z.string().cuid();
export const UuidSchema = z.string().uuid();

// Common validation schemas
export const EmailSchema = z.string().email();
export const UrlSchema = z.string().url();
export const PhoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);

// Crypto addresses
export const EthereumAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/);
export const TransactionHashSchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/);

// File upload
export const FileUploadSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
  size: z.number().positive(),
  buffer: z.instanceof(Buffer),
});

export type FileUpload = z.infer<typeof FileUploadSchema>;

// Error handling
export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
  timestamp: z.string().datetime(),
  path: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// Pagination helpers
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

// Sort options
export const SortDirectionSchema = z.enum(['asc', 'desc']);
export type SortDirection = z.infer<typeof SortDirectionSchema>;

export const SortOptionSchema = z.object({
  field: z.string(),
  direction: SortDirectionSchema,
});

export type SortOption = z.infer<typeof SortOptionSchema>;

// Filter types
export interface FilterOption {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith';
  value: unknown;
}

// Search parameters
export const SearchParamsSchema = z.object({
  query: z.string().optional(),
  filters: z.array(z.object({
    field: z.string(),
    operator: z.enum(['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'in', 'nin', 'contains', 'startsWith', 'endsWith']),
    value: z.unknown(),
  })).optional(),
  sort: z.array(SortOptionSchema).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export type SearchParams = z.infer<typeof SearchParamsSchema>;

// Locale/Language
export const LocaleSchema = z.enum(['en', 'es', 'fr']);
export type Locale = z.infer<typeof LocaleSchema>;

// Status types
export const StatusSchema = z.enum(['active', 'inactive', 'pending', 'archived']);
export type Status = z.infer<typeof StatusSchema>;

// Audit trail
export interface AuditTrail {
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  version: number;
}

// Soft delete
export interface SoftDeletable {
  deletedAt?: string;
  deletedBy?: string;
  isDeleted: boolean;
}

// Geographic data
export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type Coordinates = z.infer<typeof CoordinatesSchema>;

export const LocationSchema = z.object({
  address: z.string(),
  city: z.string(),
  region: z.string(),
  country: z.string(),
  postalCode: z.string().optional(),
  coordinates: CoordinatesSchema.optional(),
});

export type Location = z.infer<typeof LocationSchema>;

// Rate limiting
export interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
}

// Cache control
export interface CacheControl {
  maxAge: number;
  sMaxAge?: number;
  public?: boolean;
  private?: boolean;
  noCache?: boolean;
  noStore?: boolean;
  mustRevalidate?: boolean;
}

// Health check
export const HealthStatusSchema = z.enum(['healthy', 'degraded', 'unhealthy']);
export type HealthStatus = z.infer<typeof HealthStatusSchema>;

export const HealthCheckSchema = z.object({
  status: HealthStatusSchema,
  timestamp: z.string().datetime(),
  services: z.record(z.object({
    status: HealthStatusSchema,
    latency?: z.number(),
    message?: z.string(),
  })),
});

export type HealthCheck = z.infer<typeof HealthCheckSchema>;

// Configuration
export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    port: number;
    url: string;
  };
  database: {
    url: string;
    ssl: boolean;
    poolSize: number;
  };
  auth: {
    jwtSecret: string;
    jwtExpiresIn: string;
    worldIdAppId: string;
    worldIdAction: string;
  };
  blockchain: {
    rpcUrl: string;
    chainId: number;
    contracts: {
      profileSBT: string;
      escrow: string;
      reputation: string;
    };
  };
  storage: {
    ipfs: {
      projectId: string;
      projectSecret: string;
      endpoint: string;
    };
  };
  features: {
    enablePayToReveal: boolean;
    enableEscrow: boolean;
    enableReputationAttestations: boolean;
    maxServicePrice: number;
    revealFeeUSDC: number;
  };
}

// Metrics and Analytics
export interface Metrics {
  timestamp: string;
  metric: string;
  value: number;
  tags?: Record<string, string>;
}

// Event types for event sourcing
export interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  data: Record<string, unknown>;
  metadata: {
    timestamp: string;
    version: number;
    causationId?: string;
    correlationId?: string;
  };
}