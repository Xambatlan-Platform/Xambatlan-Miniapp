// Database types that mirror Prisma models
export interface User {
  id: string;
  worldIdHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  type: 'PROVIDER' | 'CLIENT';
  username: string;
  avatarUrl?: string;
  avatarEmoji?: string;
  bio?: string;
  contactHash: string;
  contactCiphertext: string;
  sbtTokenId?: string;
  reputationScore: number;
  totalReviews: number;
  ipfsCid?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbService {
  id: string;
  ownerId: string;
  category: string;
  title: string;
  description: string;
  priceModel: 'HOURLY' | 'FIXED' | 'NEGOTIABLE';
  price?: number;
  currency: string;
  ipfsCid?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbAvailabilitySlot {
  id: string;
  serviceId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone: string;
  createdAt: Date;
}

export interface DbRevealRequest {
  id: string;
  serviceId: string;
  clientId: string;
  providerId: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'EXPIRED';
  paymentRef: string;
  paymentAmount?: number;
  message?: string;
  consentSignature?: string;
  consentMessage?: string;
  accessToken?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbDeal {
  id: string;
  serviceId: string;
  clientId: string;
  providerId: string;
  onChain: boolean;
  escrowTx?: string;
  amount?: number;
  currency?: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  agreementHash?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface DbReview {
  id: string;
  dealId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  text?: string;
  attestationRef?: string;
  createdAt: Date;
}

export interface DbBadge {
  id: string;
  userId: string;
  kind: 'VERIFIED_PROVIDER' | 'TOP_RATED' | 'QUICK_RESPONDER' | 'RELIABLE' | 'NEWCOMER' | 'EARLY_ADOPTER' | 'FREQUENT_CLIENT' | 'TRUSTED_ESCROW';
  title: string;
  description: string;
  iconUrl?: string;
  awardedAt: Date;
}

export interface DbAuditLog {
  id: string;
  userId?: string;
  action: 'USER_VERIFY' | 'PROFILE_CREATE' | 'PROFILE_UPDATE' | 'SERVICE_CREATE' | 'SERVICE_UPDATE' | 'REVEAL_REQUEST' | 'REVEAL_CONSENT' | 'REVEAL_ACCESS' | 'DEAL_CREATE' | 'DEAL_UPDATE' | 'DEAL_COMPLETE' | 'REVIEW_CREATE' | 'BADGE_AWARD';
  resourceType: string;
  resourceId: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface DbServiceCategory {
  id: string;
  slug: string;
  name: string;
  nameEs: string;
  description?: string;
  iconUrl?: string;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
}

// Extended types with relations
export interface UserWithProfile extends User {
  profile?: Profile;
}

export interface ServiceWithOwner extends DbService {
  owner: User;
  availability: DbAvailabilitySlot[];
}

export interface DealWithParticipants extends DbDeal {
  service: DbService;
  client: User;
  provider: User;
}

export interface ReviewWithUsers extends DbReview {
  fromUser: User;
  toUser: User;
  deal: DbDeal;
}