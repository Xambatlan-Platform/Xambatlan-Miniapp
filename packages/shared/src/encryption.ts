import _sodium from 'libsodium-wrappers';
import { createHash, randomBytes } from 'crypto';
import type { ContactInfo } from '@xambitlan/types';

// Initialize sodium
let sodium: typeof _sodium;

async function getSodium() {
  if (!sodium) {
    await _sodium.ready;
    sodium = _sodium;
  }
  return sodium;
}

/**
 * Envelope encryption for PII data
 * Uses a Key Encryption Key (KEK) to encrypt Data Encryption Keys (DEK)
 * This allows for secure storage of contact information
 */
export class EncryptionService {
  private kek: Uint8Array;

  constructor(kekHex?: string) {
    if (kekHex) {
      this.kek = Buffer.from(kekHex, 'hex');
    } else {
      // Generate a new KEK if none provided (for testing)
      this.kek = randomBytes(32);
    }

    if (this.kek.length !== 32) {
      throw new Error('KEK must be exactly 32 bytes (256 bits)');
    }
  }

  /**
   * Generate a new Data Encryption Key
   */
  private async generateDEK(): Promise<Uint8Array> {
    const sodium = await getSodium();
    return sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
  }

  /**
   * Encrypt a DEK with the KEK
   */
  private async encryptDEK(dek: Uint8Array): Promise<string> {
    const sodium = await getSodium();
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    const encryptedDEK = sodium.crypto_secretbox_easy(dek, nonce, this.kek);

    // Combine nonce + encrypted DEK and encode as base64
    const combined = new Uint8Array(nonce.length + encryptedDEK.length);
    combined.set(nonce);
    combined.set(encryptedDEK, nonce.length);

    return Buffer.from(combined).toString('base64');
  }

  /**
   * Decrypt a DEK with the KEK
   */
  private async decryptDEK(encryptedDEKBase64: string): Promise<Uint8Array> {
    const sodium = await getSodium();
    const combined = Buffer.from(encryptedDEKBase64, 'base64');

    const nonce = combined.slice(0, sodium.crypto_secretbox_NONCEBYTES);
    const encryptedDEK = combined.slice(sodium.crypto_secretbox_NONCEBYTES);

    return sodium.crypto_secretbox_open_easy(encryptedDEK, nonce, this.kek);
  }

  /**
   * Encrypt contact information using envelope encryption
   */
  async encryptContactInfo(contactInfo: ContactInfo): Promise<{
    ciphertext: string;
    hash: string;
  }> {
    const sodium = await getSodium();

    // Generate a new DEK for this data
    const dek = await this.generateDEK();

    // Encrypt the contact info with the DEK
    const plaintext = JSON.stringify(contactInfo);
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    const encryptedData = sodium.crypto_secretbox_easy(plaintext, nonce, dek);

    // Encrypt the DEK with the KEK
    const encryptedDEK = await this.encryptDEK(dek);

    // Combine everything: [encrypted_dek_length][encrypted_dek][nonce][encrypted_data]
    const dekLengthBuffer = Buffer.alloc(4);
    dekLengthBuffer.writeUInt32BE(Buffer.from(encryptedDEK, 'base64').length);

    const combined = Buffer.concat([
      dekLengthBuffer,
      Buffer.from(encryptedDEK, 'base64'),
      Buffer.from(nonce),
      Buffer.from(encryptedData)
    ]);

    const ciphertext = combined.toString('base64');

    // Create a hash for public verification (doesn't reveal content)
    const hash = createHash('sha256').update(plaintext).digest('hex');

    return { ciphertext, hash };
  }

  /**
   * Decrypt contact information
   */
  async decryptContactInfo(ciphertext: string): Promise<ContactInfo> {
    const sodium = await getSodium();
    const combined = Buffer.from(ciphertext, 'base64');

    // Extract components
    const dekLength = combined.readUInt32BE(0);
    const encryptedDEKBuffer = combined.slice(4, 4 + dekLength);
    const nonce = combined.slice(4 + dekLength, 4 + dekLength + sodium.crypto_secretbox_NONCEBYTES);
    const encryptedData = combined.slice(4 + dekLength + sodium.crypto_secretbox_NONCEBYTES);

    // Decrypt the DEK
    const encryptedDEKBase64 = encryptedDEKBuffer.toString('base64');
    const dek = await this.decryptDEK(encryptedDEKBase64);

    // Decrypt the data
    const decryptedBytes = sodium.crypto_secretbox_open_easy(encryptedData, nonce, dek);
    const plaintext = Buffer.from(decryptedBytes).toString('utf8');

    return JSON.parse(plaintext);
  }

  /**
   * Verify that encrypted data matches a hash
   */
  async verifyContactHash(ciphertext: string, expectedHash: string): Promise<boolean> {
    try {
      const decrypted = await this.decryptContactInfo(ciphertext);
      const plaintext = JSON.stringify(decrypted);
      const actualHash = createHash('sha256').update(plaintext).digest('hex');
      return actualHash === expectedHash;
    } catch {
      return false;
    }
  }

  /**
   * Create a hash of contact info for public storage (verification only)
   */
  static createContactHash(contactInfo: ContactInfo): string {
    const plaintext = JSON.stringify(contactInfo);
    return createHash('sha256').update(plaintext).digest('hex');
  }
}

/**
 * Generate a time-boxed access token for reveal requests
 */
export class AccessTokenService {
  private secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  /**
   * Generate an access token that expires after a certain time
   */
  generateToken(payload: {
    requestId: string;
    clientId: string;
    providerId: string;
    expiresAt: number;
  }): string {
    const data = JSON.stringify(payload);
    const signature = createHash('hmac-sha256')
      .setEncoding('hex')
      .update(data)
      .update(this.secret)
      .digest('hex');

    const token = Buffer.from(`${data}.${signature}`).toString('base64url');
    return token;
  }

  /**
   * Verify and decode an access token
   */
  verifyToken(token: string): {
    valid: boolean;
    payload?: {
      requestId: string;
      clientId: string;
      providerId: string;
      expiresAt: number;
    };
    reason?: 'invalid_format' | 'invalid_signature' | 'expired';
  } {
    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf8');
      const [data, signature] = decoded.split('.');

      if (!data || !signature) {
        return { valid: false, reason: 'invalid_format' };
      }

      // Verify signature
      const expectedSignature = createHash('hmac-sha256')
        .setEncoding('hex')
        .update(data)
        .update(this.secret)
        .digest('hex');

      if (signature !== expectedSignature) {
        return { valid: false, reason: 'invalid_signature' };
      }

      const payload = JSON.parse(data);

      // Check expiration
      if (Date.now() > payload.expiresAt) {
        return { valid: false, reason: 'expired', payload };
      }

      return { valid: true, payload };
    } catch {
      return { valid: false, reason: 'invalid_format' };
    }
  }
}

/**
 * Utility for creating nonces and hashing them (for World ID integration)
 */
export class NonceService {
  /**
   * Generate a cryptographically secure nonce
   */
  static generateNonce(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Hash a nonce for verification (matches the pattern in existing auth)
   */
  static hashNonce(nonce: string): string {
    return createHash('keccak256').update(nonce).digest('hex');
  }

  /**
   * Verify a nonce against its hash
   */
  static verifyNonce(nonce: string, hash: string): boolean {
    return this.hashNonce(nonce) === hash;
  }
}

/**
 * Utility for creating audit trails
 */
export interface AuditEntry {
  userId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export class AuditService {
  /**
   * Create a tamper-evident audit entry
   */
  static createAuditEntry(entry: Omit<AuditEntry, 'timestamp'>): AuditEntry {
    return {
      ...entry,
      timestamp: new Date(),
    };
  }

  /**
   * Create a hash chain for audit entries (for tamper detection)
   */
  static createAuditHash(entry: AuditEntry, previousHash?: string): string {
    const data = JSON.stringify({
      ...entry,
      timestamp: entry.timestamp.toISOString(),
      previousHash: previousHash || '0',
    });

    return createHash('sha256').update(data).digest('hex');
  }
}

// Export default instance with environment KEK
export const getEncryptionService = () => {
  const kek = process.env.ENCRYPTION_KEY;
  if (!kek) {
    throw new Error('ENCRYPTION_KEY environment variable is required');
  }
  return new EncryptionService(kek);
};

export const getAccessTokenService = () => {
  const secret = process.env.JWT_SECRET || process.env.HMAC_SECRET_KEY;
  if (!secret) {
    throw new Error('JWT_SECRET or HMAC_SECRET_KEY environment variable is required');
  }
  return new AccessTokenService(secret);
};