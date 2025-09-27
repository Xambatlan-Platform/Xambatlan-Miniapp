import { z } from 'zod';

// Base API Response
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Pagination
export const PaginationParamsSchema = z.object({
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),
});

export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) => z.object({
  items: z.array(itemSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
  hasMore: z.boolean(),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
};

// Profile Types
export const ProfileTypeSchema = z.enum(['PROVIDER', 'CLIENT']);
export type ProfileType = z.infer<typeof ProfileTypeSchema>;

export const ContactInfoSchema = z.object({
  whatsapp: z.string().optional(),
  website: z.string().url().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  email: z.string().email().optional(),
});

export type ContactInfo = z.infer<typeof ContactInfoSchema>;

export const PublicProfileSchema = z.object({
  id: z.string(),
  type: ProfileTypeSchema,
  username: z.string(),
  avatarUrl: z.string().url().nullable(),
  avatarEmoji: z.string().nullable(),
  bio: z.string().nullable(),
  contactHash: z.string(),
  reputationScore: z.number().min(0).max(5),
  totalReviews: z.number().min(0),
  badges: z.array(z.object({
    id: z.string(),
    kind: z.string(),
    title: z.string(),
    iconUrl: z.string().url().nullable(),
  })),
  createdAt: z.string().datetime(),
});

export type PublicProfile = z.infer<typeof PublicProfileSchema>;

export const CreateProfileRequestSchema = z.object({
  type: ProfileTypeSchema,
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  avatarUrl: z.string().url().optional(),
  avatarEmoji: z.string().optional(),
  bio: z.string().max(500).optional(),
  contactInfo: ContactInfoSchema,
});

export type CreateProfileRequest = z.infer<typeof CreateProfileRequestSchema>;

// Service Types
export const PriceModelSchema = z.enum(['HOURLY', 'FIXED', 'NEGOTIABLE']);
export type PriceModel = z.infer<typeof PriceModelSchema>;

export const AvailabilitySlotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  timezone: z.string().default('UTC'),
});

export type AvailabilitySlot = z.infer<typeof AvailabilitySlotSchema>;

export const ServiceSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  category: z.string(),
  title: z.string(),
  description: z.string(),
  priceModel: PriceModelSchema,
  price: z.number().nullable(),
  currency: z.string().default('USDC'),
  availability: z.array(AvailabilitySlotSchema),
  ipfsCid: z.string().nullable(),
  active: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Service = z.infer<typeof ServiceSchema>;

export const ServiceWithProviderSchema = ServiceSchema.extend({
  provider: PublicProfileSchema,
});

export type ServiceWithProvider = z.infer<typeof ServiceWithProviderSchema>;

export const CreateServiceRequestSchema = z.object({
  category: z.string(),
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(1000),
  priceModel: PriceModelSchema,
  price: z.number().min(0).optional(),
  currency: z.string().default('USDC'),
  availability: z.array(AvailabilitySlotSchema).default([]),
});

export type CreateServiceRequest = z.infer<typeof CreateServiceRequestSchema>;

// Reveal Flow Types
export const RevealStatusSchema = z.enum(['PENDING', 'APPROVED', 'DENIED', 'EXPIRED']);
export type RevealStatus = z.infer<typeof RevealStatusSchema>;

export const RevealRequestSchema = z.object({
  paymentProof: z.string(),
  message: z.string().max(500).optional(),
});

export type RevealRequest = z.infer<typeof RevealRequestSchema>;

export const ConsentRequestSchema = z.object({
  signature: z.string(),
  signedMessage: z.string(),
  consent: z.boolean(),
});

export type ConsentRequest = z.infer<typeof ConsentRequestSchema>;

// Deal Types
export const DealStatusSchema = z.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED']);
export type DealStatus = z.infer<typeof DealStatusSchema>;

export const CreateDealRequestSchema = z.object({
  serviceId: z.string(),
  onChain: z.boolean(),
  amount: z.number().min(0).optional(),
  currency: z.string().default('USDC'),
  agreementHash: z.string().optional(),
});

export type CreateDealRequest = z.infer<typeof CreateDealRequestSchema>;

export const DealSchema = z.object({
  id: z.string(),
  serviceId: z.string(),
  clientId: z.string(),
  providerId: z.string(),
  onChain: z.boolean(),
  escrowTx: z.string().nullable(),
  amount: z.number().nullable(),
  currency: z.string().nullable(),
  status: DealStatusSchema,
  agreementHash: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
});

export type Deal = z.infer<typeof DealSchema>;

// Review Types
export const CreateReviewRequestSchema = z.object({
  dealId: z.string(),
  toUserId: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string().max(1000).optional(),
});

export type CreateReviewRequest = z.infer<typeof CreateReviewRequestSchema>;

export const ReviewSchema = z.object({
  id: z.string(),
  dealId: z.string(),
  fromUserId: z.string(),
  toUserId: z.string(),
  rating: z.number().min(1).max(5),
  text: z.string().nullable(),
  attestationRef: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export type Review = z.infer<typeof ReviewSchema>;

// Service Categories
export const ServiceCategorySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  nameEs: z.string(),
  description: z.string().nullable(),
  iconUrl: z.string().nullable(),
  active: z.boolean(),
  sortOrder: z.number(),
});

export type ServiceCategory = z.infer<typeof ServiceCategorySchema>;

// Badge Types
export const BadgeTypeSchema = z.enum([
  'VERIFIED_PROVIDER',
  'TOP_RATED',
  'QUICK_RESPONDER',
  'RELIABLE',
  'NEWCOMER',
  'EARLY_ADOPTER',
  'FREQUENT_CLIENT',
  'TRUSTED_ESCROW'
]);

export type BadgeType = z.infer<typeof BadgeTypeSchema>;

export const BadgeSchema = z.object({
  id: z.string(),
  userId: z.string(),
  kind: BadgeTypeSchema,
  title: z.string(),
  description: z.string(),
  iconUrl: z.string().url().nullable(),
  awardedAt: z.string().datetime(),
});

export type Badge = z.infer<typeof BadgeSchema>;