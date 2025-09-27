import { create } from 'ipfs-http-client';
import type { IPFSMetadata, ProfileMetadata, ServiceMetadata } from '@xambitlan/types';

export interface IPFSConfig {
  projectId?: string;
  projectSecret?: string;
  endpoint?: string;
}

/**
 * IPFS service for storing and retrieving metadata
 */
export class IPFSService {
  private client: any;

  constructor(config: IPFSConfig = {}) {
    const {
      projectId = process.env.IPFS_PROJECT_ID,
      projectSecret = process.env.IPFS_PROJECT_SECRET,
      endpoint = process.env.IPFS_ENDPOINT || 'https://ipfs.infura.io:5001'
    } = config;

    if (projectId && projectSecret) {
      // Use Infura IPFS with authentication
      const auth = Buffer.from(`${projectId}:${projectSecret}`).toString('base64');
      this.client = create({
        url: endpoint,
        headers: {
          authorization: `Basic ${auth}`
        }
      });
    } else {
      // Use local IPFS node or public gateway
      this.client = create({ url: endpoint });
    }
  }

  /**
   * Pin content to IPFS and return the CID
   */
  async pinContent(content: string | Buffer | object): Promise<string> {
    try {
      let data: Buffer;

      if (typeof content === 'string') {
        data = Buffer.from(content, 'utf8');
      } else if (Buffer.isBuffer(content)) {
        data = content;
      } else {
        data = Buffer.from(JSON.stringify(content, null, 2), 'utf8');
      }

      const result = await this.client.add(data, {
        pin: true,
        cidVersion: 1
      });

      return result.cid.toString();
    } catch (error) {
      throw new Error(`Failed to pin content to IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieve content from IPFS by CID
   */
  async getContent(cid: string): Promise<string> {
    try {
      const chunks: Uint8Array[] = [];

      for await (const chunk of this.client.cat(cid)) {
        chunks.push(chunk);
      }

      const content = Buffer.concat(chunks).toString('utf8');
      return content;
    } catch (error) {
      throw new Error(`Failed to retrieve content from IPFS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get JSON content from IPFS
   */
  async getJSON<T = any>(cid: string): Promise<T> {
    const content = await this.getContent(cid);
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse JSON from IPFS content: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
    }
  }

  /**
   * Create and store profile metadata
   */
  async storeProfileMetadata(metadata: Omit<ProfileMetadata, 'version'>): Promise<string> {
    const fullMetadata: ProfileMetadata = {
      version: '1.0',
      ...metadata
    };

    return this.pinContent(fullMetadata);
  }

  /**
   * Create and store service metadata
   */
  async storeServiceMetadata(metadata: Omit<ServiceMetadata, 'version'>): Promise<string> {
    const fullMetadata: ServiceMetadata = {
      version: '1.0',
      ...metadata
    };

    return this.pinContent(fullMetadata);
  }

  /**
   * Store file and return CID
   */
  async storeFile(file: Buffer, filename?: string): Promise<{
    cid: string;
    size: number;
  }> {
    try {
      const result = await this.client.add(file, {
        pin: true,
        cidVersion: 1,
        wrapWithDirectory: filename ? true : false,
        ...(filename && { path: filename })
      });

      return {
        cid: result.cid.toString(),
        size: result.size
      };
    } catch (error) {
      throw new Error(`Failed to store file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if content exists and is accessible
   */
  async exists(cid: string): Promise<boolean> {
    try {
      const stats = await this.client.object.stat(cid);
      return !!stats;
    } catch {
      return false;
    }
  }

  /**
   * Get content stats
   */
  async getStats(cid: string): Promise<{
    size: number;
    type: string;
  }> {
    try {
      const stats = await this.client.object.stat(cid);
      return {
        size: stats.CumulativeSize,
        type: 'object' // Could be enhanced to detect actual type
      };
    } catch (error) {
      throw new Error(`Failed to get IPFS stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate IPFS gateway URL for public access
   */
  static getGatewayUrl(cid: string, gateway = 'https://ipfs.io/ipfs'): string {
    return `${gateway}/${cid}`;
  }

  /**
   * Extract CID from various IPFS URL formats
   */
  static extractCID(input: string): string | null {
    // Handle direct CID
    if (input.match(/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/) || input.match(/^bafy[a-z0-9]+$/)) {
      return input;
    }

    // Handle IPFS URLs
    const patterns = [
      /ipfs\/([Qm][1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]+)/,
      /\/ipfs\/([Qm][1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]+)/,
      /ipfs:\/\/([Qm][1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]+)/
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }
}

// Default IPFS service instance
export const getIPFSService = () => {
  return new IPFSService();
};

// Utility functions for common metadata operations
export const createProfileMetadata = (
  profileType: 'PROVIDER' | 'CLIENT',
  username: string,
  bio?: string,
  categories?: string[]
): Omit<ProfileMetadata, 'version'> => ({
  type: 'profile',
  name: username,
  profileType,
  username,
  description: bio,
  ...(categories && { categories }),
  attributes: [
    { trait_type: 'Profile Type', value: profileType },
    { trait_type: 'Username', value: username },
    ...(categories?.map(cat => ({ trait_type: 'Category', value: cat })) || [])
  ]
});

export const createServiceMetadata = (
  category: string,
  title: string,
  description: string,
  priceModel: string,
  tags?: string[]
): Omit<ServiceMetadata, 'version'> => ({
  type: 'service',
  name: title,
  category,
  title,
  description,
  priceModel,
  ...(tags && { tags }),
  attributes: [
    { trait_type: 'Category', value: category },
    { trait_type: 'Price Model', value: priceModel },
    ...(tags?.map(tag => ({ trait_type: 'Tag', value: tag })) || [])
  ]
});