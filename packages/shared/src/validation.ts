import { z } from 'zod';

/**
 * World ID proof validation utilities
 */
export class WorldIDValidator {
  /**
   * Validate World ID nullifier hash format
   */
  static validateNullifierHash(hash: string): boolean {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  }

  /**
   * Validate World ID merkle root format
   */
  static validateMerkleRoot(root: string): boolean {
    return /^0x[a-fA-F0-9]{64}$/.test(root);
  }

  /**
   * Validate World ID proof format
   */
  static validateProof(proof: string): boolean {
    try {
      const parsed = JSON.parse(proof);
      return Array.isArray(parsed) && parsed.length === 8;
    } catch {
      return false;
    }
  }

  /**
   * Validate action identifier
   */
  static validateAction(action: string): boolean {
    return action.length >= 3 && action.length <= 50 && /^[a-zA-Z0-9_-]+$/.test(action);
  }
}

/**
 * Username validation with additional rules
 */
export class UsernameValidator {
  private static readonly RESERVED_USERNAMES = new Set([
    'admin', 'administrator', 'api', 'app', 'assets', 'blog', 'cdn', 'client',
    'contact', 'dashboard', 'dev', 'docs', 'ftp', 'help', 'info', 'mail',
    'news', 'null', 'root', 'server', 'shop', 'smtp', 'staff', 'stage',
    'support', 'undefined', 'user', 'users', 'web', 'www', 'xambitlan'
  ]);

  /**
   * Validate username according to platform rules
   */
  static validate(username: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Length check
    if (username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }
    if (username.length > 30) {
      errors.push('Username must be no more than 30 characters long');
    }

    // Character check
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }

    // Must start with letter or number
    if (!/^[a-zA-Z0-9]/.test(username)) {
      errors.push('Username must start with a letter or number');
    }

    // Cannot end with underscore
    if (username.endsWith('_')) {
      errors.push('Username cannot end with an underscore');
    }

    // No consecutive underscores
    if (username.includes('__')) {
      errors.push('Username cannot contain consecutive underscores');
    }

    // Reserved names
    if (this.RESERVED_USERNAMES.has(username.toLowerCase())) {
      errors.push('This username is reserved');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Suggest alternative usernames if the desired one is invalid or taken
   */
  static suggest(baseUsername: string): string[] {
    const cleaned = baseUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
    const suggestions: string[] = [];

    if (cleaned.length >= 3) {
      // Add numbers
      for (let i = 1; i <= 99; i++) {
        suggestions.push(`${cleaned}${i}`);
        if (suggestions.length >= 5) break;
      }

      // Add descriptive suffixes
      const suffixes = ['pro', 'expert', 'master', 'plus', 'top'];
      for (const suffix of suffixes) {
        if (cleaned.length + suffix.length <= 30) {
          suggestions.push(`${cleaned}_${suffix}`);
        }
      }
    }

    return suggestions.slice(0, 10);
  }
}

/**
 * Contact information validation
 */
export class ContactValidator {
  /**
   * Validate WhatsApp number
   */
  static validateWhatsApp(number: string): boolean {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, '');

    // Should be between 10-15 digits and start with country code
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  /**
   * Validate website URL
   */
  static validateWebsite(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Validate social media username
   */
  static validateSocialUsername(username: string): boolean {
    // Allow letters, numbers, dots, underscores
    return /^[a-zA-Z0-9._]{1,30}$/.test(username) && !username.includes('..');
  }

  /**
   * Extract and validate Instagram username from URL or handle
   */
  static extractInstagram(input: string): string | null {
    // Handle @username format
    if (input.startsWith('@')) {
      const username = input.slice(1);
      return this.validateSocialUsername(username) ? username : null;
    }

    // Handle URL format
    const urlMatch = input.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)/);
    if (urlMatch) {
      return this.validateSocialUsername(urlMatch[1]) ? urlMatch[1] : null;
    }

    // Handle direct username
    return this.validateSocialUsername(input) ? input : null;
  }

  /**
   * Extract and validate Facebook username from URL or handle
   */
  static extractFacebook(input: string): string | null {
    // Handle URL format
    const urlMatch = input.match(/(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9.]+)/);
    if (urlMatch) {
      return urlMatch[1];
    }

    // Handle direct username
    return /^[a-zA-Z0-9.]{5,50}$/.test(input) ? input : null;
  }
}

/**
 * Service validation
 */
export class ServiceValidator {
  private static readonly MIN_TITLE_LENGTH = 5;
  private static readonly MAX_TITLE_LENGTH = 100;
  private static readonly MIN_DESCRIPTION_LENGTH = 20;
  private static readonly MAX_DESCRIPTION_LENGTH = 1000;

  /**
   * Validate service title
   */
  static validateTitle(title: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (title.length < this.MIN_TITLE_LENGTH) {
      errors.push(`Title must be at least ${this.MIN_TITLE_LENGTH} characters long`);
    }

    if (title.length > this.MAX_TITLE_LENGTH) {
      errors.push(`Title must be no more than ${this.MAX_TITLE_LENGTH} characters long`);
    }

    // Check for meaningful content (not just spaces or special characters)
    if (!/[a-zA-Z]/.test(title)) {
      errors.push('Title must contain at least some letters');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate service description
   */
  static validateDescription(description: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (description.length < this.MIN_DESCRIPTION_LENGTH) {
      errors.push(`Description must be at least ${this.MIN_DESCRIPTION_LENGTH} characters long`);
    }

    if (description.length > this.MAX_DESCRIPTION_LENGTH) {
      errors.push(`Description must be no more than ${this.MAX_DESCRIPTION_LENGTH} characters long`);
    }

    // Check for meaningful content
    const wordCount = description.trim().split(/\s+/).length;
    if (wordCount < 5) {
      errors.push('Description must contain at least 5 words');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Validate price for different models
   */
  static validatePrice(price: number | null, priceModel: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (priceModel === 'negotiable') {
      // Price is optional for negotiable services
      return { valid: true, errors: [] };
    }

    if (price === null || price === undefined) {
      errors.push('Price is required for fixed and hourly services');
      return { valid: false, errors };
    }

    if (price < 0) {
      errors.push('Price cannot be negative');
    }

    if (price > 10000) {
      errors.push('Price cannot exceed $10,000 USDC');
    }

    // Minimum reasonable prices
    if (priceModel === 'hourly' && price < 1) {
      errors.push('Hourly rate must be at least $1 USDC');
    }

    if (priceModel === 'fixed' && price < 5) {
      errors.push('Fixed price must be at least $5 USDC');
    }

    return { valid: errors.length === 0, errors };
  }
}

/**
 * Availability validation
 */
export class AvailabilityValidator {
  /**
   * Validate time format (HH:MM)
   */
  static validateTime(time: string): boolean {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  }

  /**
   * Validate time range
   */
  static validateTimeRange(startTime: string, endTime: string): { valid: boolean; error?: string } {
    if (!this.validateTime(startTime)) {
      return { valid: false, error: 'Invalid start time format' };
    }

    if (!this.validateTime(endTime)) {
      return { valid: false, error: 'Invalid end time format' };
    }

    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    if (start >= end) {
      return { valid: false, error: 'End time must be after start time' };
    }

    if (end - start < 60) {
      return { valid: false, error: 'Availability slot must be at least 1 hour' };
    }

    if (end - start > 16 * 60) {
      return { valid: false, error: 'Availability slot cannot exceed 16 hours' };
    }

    return { valid: true };
  }

  /**
   * Convert time string to minutes since midnight
   */
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Validate day of week
   */
  static validateDayOfWeek(day: number): boolean {
    return Number.isInteger(day) && day >= 0 && day <= 6;
  }
}

/**
 * Review validation
 */
export class ReviewValidator {
  private static readonly MAX_REVIEW_LENGTH = 1000;

  /**
   * Validate review rating
   */
  static validateRating(rating: number): { valid: boolean; error?: string } {
    if (!Number.isInteger(rating)) {
      return { valid: false, error: 'Rating must be a whole number' };
    }

    if (rating < 1 || rating > 5) {
      return { valid: false, error: 'Rating must be between 1 and 5 stars' };
    }

    return { valid: true };
  }

  /**
   * Validate review text
   */
  static validateReviewText(text: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (text.length > this.MAX_REVIEW_LENGTH) {
      errors.push(`Review text cannot exceed ${this.MAX_REVIEW_LENGTH} characters`);
    }

    // Check for spam patterns (very basic)
    const suspiciousPatterns = [
      /(.)\1{10,}/, // Repeated characters
      /https?:\/\/[^\s]+/g, // URLs (basic check)
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(text)) {
        errors.push('Review text contains suspicious content');
        break;
      }
    }

    return { valid: errors.length === 0, errors };
  }
}

// Validation schema builders
export const buildContactInfoSchema = () => z.object({
  whatsapp: z.string().optional().refine(
    (val) => !val || ContactValidator.validateWhatsApp(val),
    'Invalid WhatsApp number format'
  ),
  website: z.string().url().optional().refine(
    (val) => !val || ContactValidator.validateWebsite(val),
    'Invalid website URL'
  ),
  facebook: z.string().optional().refine(
    (val) => !val || ContactValidator.extractFacebook(val) !== null,
    'Invalid Facebook profile'
  ),
  instagram: z.string().optional().refine(
    (val) => !val || ContactValidator.extractInstagram(val) !== null,
    'Invalid Instagram handle'
  ),
  email: z.string().email().optional(),
});

export const buildServiceSchema = () => z.object({
  title: z.string().refine(
    (val) => ServiceValidator.validateTitle(val).valid,
    (val) => ({ message: ServiceValidator.validateTitle(val).errors[0] || 'Invalid title' })
  ),
  description: z.string().refine(
    (val) => ServiceValidator.validateDescription(val).valid,
    (val) => ({ message: ServiceValidator.validateDescription(val).errors[0] || 'Invalid description' })
  ),
  priceModel: z.enum(['hourly', 'fixed', 'negotiable']),
  price: z.number().nullable(),
}).refine(
  (data) => ServiceValidator.validatePrice(data.price, data.priceModel).valid,
  (data) => ({
    message: ServiceValidator.validatePrice(data.price, data.priceModel).errors[0] || 'Invalid price',
    path: ['price']
  })
);