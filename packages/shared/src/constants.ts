/**
 * Application constants and configuration
 */

// Service Categories
export const SERVICE_CATEGORIES = {
  CONSTRUCCION: {
    slug: 'construccion',
    name: 'Construction & Building',
    nameEs: 'Construcción y Albañilería',
    icon: '🏗️',
    description: 'Construction, masonry, plumbing, electrical work',
  },
  LIMPIEZA: {
    slug: 'limpieza',
    name: 'Cleaning Services',
    nameEs: 'Servicios de Limpieza',
    icon: '🧹',
    description: 'House cleaning, office cleaning, deep cleaning',
  },
  TECNOLOGIA: {
    slug: 'tecnologia',
    name: 'Technology & IT',
    nameEs: 'Tecnología e Informática',
    icon: '💻',
    description: 'Computer repair, web development, tech support',
  },
  JARDINERIA: {
    slug: 'jardineria',
    name: 'Gardening & Landscaping',
    nameEs: 'Jardinería y Paisajismo',
    icon: '🌱',
    description: 'Garden maintenance, landscaping, plant care',
  },
  TRANSPORTE: {
    slug: 'transporte',
    name: 'Transportation',
    nameEs: 'Transporte',
    icon: '🚚',
    description: 'Delivery, moving services, personal transport',
  },
  EDUCACION: {
    slug: 'educacion',
    name: 'Education & Tutoring',
    nameEs: 'Educación y Tutorías',
    icon: '📚',
    description: 'Private tutoring, language lessons, skill teaching',
  },
  COCINA: {
    slug: 'cocina',
    name: 'Cooking & Catering',
    nameEs: 'Cocina y Catering',
    icon: '👨‍🍳',
    description: 'Personal chef, event catering, meal prep',
  },
  BELLEZA: {
    slug: 'belleza',
    name: 'Beauty & Wellness',
    nameEs: 'Belleza y Bienestar',
    icon: '💄',
    description: 'Hair styling, massage, beauty treatments',
  },
} as const;

// Badge Types and Configurations
export const BADGE_CONFIGS = {
  VERIFIED_PROVIDER: {
    title: 'Verified Provider',
    description: 'Identity verified through World ID',
    icon: '✅',
    color: '#10B981',
    requirements: 'Complete World ID verification',
  },
  TOP_RATED: {
    title: 'Top Rated',
    description: 'Maintains excellent ratings from clients',
    icon: '⭐',
    color: '#F59E0B',
    requirements: '4.8+ rating with 10+ reviews',
  },
  QUICK_RESPONDER: {
    title: 'Quick Responder',
    description: 'Responds quickly to client requests',
    icon: '⚡',
    color: '#3B82F6',
    requirements: 'Fast response times',
  },
  RELIABLE: {
    title: 'Reliable',
    description: 'Consistently delivers quality work',
    icon: '🛡️',
    color: '#8B5CF6',
    requirements: '4.5+ rating with low disputes',
  },
  NEWCOMER: {
    title: 'Newcomer',
    description: 'New to the platform',
    icon: '🌟',
    color: '#06B6D4',
    requirements: 'Recently joined Xambatlán',
  },
  EARLY_ADOPTER: {
    title: 'Early Adopter',
    description: 'One of the first users on Xambatlán',
    icon: '🚀',
    color: '#EC4899',
    requirements: 'Joined during beta period',
  },
  FREQUENT_CLIENT: {
    title: 'Frequent Client',
    description: 'Regularly hires service providers',
    icon: '🔄',
    color: '#10B981',
    requirements: 'Multiple completed deals',
  },
  TRUSTED_ESCROW: {
    title: 'Trusted Escrow',
    description: 'Handles large escrow deals reliably',
    icon: '🏦',
    color: '#6366F1',
    requirements: 'High-value deals with perfect record',
  },
} as const;

// Price Limits and Defaults
export const PRICING = {
  MIN_HOURLY_RATE: 1, // USDC
  MIN_FIXED_PRICE: 5, // USDC
  MAX_SERVICE_PRICE: 10000, // USDC
  DEFAULT_REVEAL_FEE: 1, // USDC
  PLATFORM_FEE_PERCENTAGE: 2.5, // 2.5%
  MAX_PLATFORM_FEE: 50, // USDC cap
} as const;

// Time Constants
export const TIME = {
  REVEAL_ACCESS_DURATION: 30 * 60 * 1000, // 30 minutes in milliseconds
  JWT_EXPIRES_IN: '7d',
  PROFILE_CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  SERVICE_CACHE_TTL: 10 * 60 * 1000, // 10 minutes
  DEAL_EXPIRY_DEFAULT: 30 * 24 * 60 * 60 * 1000, // 30 days
  AUDIT_LOG_RETENTION: 365 * 24 * 60 * 60 * 1000, // 1 year
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  API_REQUESTS_PER_MINUTE: 100,
  PROFILE_UPDATES_PER_HOUR: 5,
  SERVICE_CREATES_PER_HOUR: 10,
  REVEAL_REQUESTS_PER_HOUR: 20,
  REVIEW_SUBMISSIONS_PER_HOUR: 10,
  AUTH_ATTEMPTS_PER_HOUR: 10,
} as const;

// File Upload Limits
export const FILE_LIMITS = {
  MAX_AVATAR_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_SERVICE_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
  MAX_IPFS_METADATA_SIZE: 100 * 1024, // 100KB JSON
} as const;

// Validation Constants
export const VALIDATION = {
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MIN_SERVICE_TITLE_LENGTH: 5,
  MAX_SERVICE_TITLE_LENGTH: 100,
  MIN_SERVICE_DESCRIPTION_LENGTH: 20,
  MAX_SERVICE_DESCRIPTION_LENGTH: 1000,
  MAX_BIO_LENGTH: 500,
  MAX_REVIEW_LENGTH: 1000,
  MIN_AVAILABILITY_SLOT_HOURS: 1,
  MAX_AVAILABILITY_SLOT_HOURS: 16,
  RESERVED_USERNAMES: [
    'admin', 'administrator', 'api', 'app', 'assets', 'blog', 'cdn', 'client',
    'contact', 'dashboard', 'dev', 'docs', 'ftp', 'help', 'info', 'mail',
    'news', 'null', 'root', 'server', 'shop', 'smtp', 'staff', 'stage',
    'support', 'undefined', 'user', 'users', 'web', 'www', 'xambitlan'
  ] as const,
} as const;

// Blockchain Constants
export const BLOCKCHAIN = {
  // Testnet addresses (placeholder)
  CONTRACTS: {
    PROFILE_SBT: '0x0000000000000000000000000000000000000000',
    ESCROW: '0x0000000000000000000000000000000000000000',
    REPUTATION: '0x0000000000000000000000000000000000000000',
  },
  TOKENS: {
    USDC: {
      address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia USDC
      decimals: 6,
      symbol: 'USDC',
    },
    WLD: {
      address: '0x2cFc85d8E48F8EAB294be644d9E25C3030863003', // Sepolia WLD
      decimals: 18,
      symbol: 'WLD',
    },
  },
  CHAIN_IDS: {
    ETHEREUM_MAINNET: 1,
    ETHEREUM_SEPOLIA: 11155111,
    WORLDCHAIN_MAINNET: 480,
    WORLDCHAIN_SEPOLIA: 4801,
    LOCAL: 31337,
  },
  GAS_LIMITS: {
    PROFILE_MINT: 200000,
    ESCROW_CREATE: 300000,
    ESCROW_RELEASE: 200000,
    ATTESTATION_CREATE: 250000,
  },
} as const;

// World ID Configuration
export const WORLD_ID = {
  ACTIONS: {
    VERIFY_HUMAN: 'verify-human',
    CREATE_PROFILE: 'create-profile',
    SUBMIT_REVIEW: 'submit-review',
  },
  VERIFICATION_LEVELS: {
    ORB: 'orb',
    DEVICE: 'device',
  },
  SIGNAL_TYPES: {
    PROFILE_CREATION: 'profile-creation',
    REVIEW_SUBMISSION: 'review-submission',
  },
} as const;

// UI Constants
export const UI = {
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
  ANIMATION_DURATION: {
    FAST: '150ms',
    NORMAL: '200ms',
    SLOW: '300ms',
  },
  Z_INDEX: {
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    TOAST: 1080,
  },
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_ESCROW: true,
  ENABLE_PAY_TO_REVEAL: true,
  ENABLE_REPUTATION_ATTESTATIONS: true,
  ENABLE_PROFILE_IMAGES: true,
  ENABLE_SERVICE_IMAGES: true,
  ENABLE_NOTIFICATIONS: false, // TODO: Implement
  ENABLE_MULTI_LANGUAGE: false, // TODO: Implement
  ENABLE_ANALYTICS: true,
  ENABLE_DEBUG_MODE: process.env.NODE_ENV === 'development',
} as const;

// Error Codes
export const ERROR_CODES = {
  // Authentication
  INVALID_WORLD_ID_PROOF: 'INVALID_WORLD_ID_PROOF',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

  // Profiles
  USERNAME_TAKEN: 'USERNAME_TAKEN',
  PROFILE_NOT_FOUND: 'PROFILE_NOT_FOUND',
  INVALID_PROFILE_TYPE: 'INVALID_PROFILE_TYPE',

  // Services
  SERVICE_NOT_FOUND: 'SERVICE_NOT_FOUND',
  INVALID_SERVICE_CATEGORY: 'INVALID_SERVICE_CATEGORY',
  PRICE_OUT_OF_RANGE: 'PRICE_OUT_OF_RANGE',

  // Reveal Flow
  REVEAL_REQUEST_NOT_FOUND: 'REVEAL_REQUEST_NOT_FOUND',
  PAYMENT_VERIFICATION_FAILED: 'PAYMENT_VERIFICATION_FAILED',
  CONSENT_SIGNATURE_INVALID: 'CONSENT_SIGNATURE_INVALID',
  ACCESS_TOKEN_EXPIRED: 'ACCESS_TOKEN_EXPIRED',

  // Deals
  DEAL_NOT_FOUND: 'DEAL_NOT_FOUND',
  UNAUTHORIZED_DEAL_ACTION: 'UNAUTHORIZED_DEAL_ACTION',
  INVALID_DEAL_STATUS: 'INVALID_DEAL_STATUS',

  // Reviews
  DUPLICATE_REVIEW: 'DUPLICATE_REVIEW',
  INVALID_RATING: 'INVALID_RATING',
  CANNOT_REVIEW_SELF: 'CANNOT_REVIEW_SELF',

  // Blockchain
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  CONTRACT_ERROR: 'CONTRACT_ERROR',

  // Generic
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_CREATED: 'Profile created successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  SERVICE_CREATED: 'Service created successfully',
  SERVICE_UPDATED: 'Service updated successfully',
  SERVICE_DELETED: 'Service deleted successfully',
  REVEAL_REQUEST_CREATED: 'Contact reveal requested',
  CONSENT_RECORDED: 'Consent recorded successfully',
  DEAL_CREATED: 'Deal created successfully',
  DEAL_COMPLETED: 'Deal completed successfully',
  REVIEW_SUBMITTED: 'Review submitted successfully',
  BADGE_AWARDED: 'Badge awarded!',
} as const;

// Default Values
export const DEFAULTS = {
  PROFILE_AVATAR_EMOJI: '👤',
  SERVICE_CURRENCY: 'USDC',
  PAGINATION_LIMIT: 20,
  REPUTATION_SCORE: 0,
  TIMEZONE: 'UTC',
  LOCALE: 'en',
} as const;