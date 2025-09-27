/**
 * Reputation calculation utilities for Xambatlán
 * Implements EWMA (Exponentially Weighted Moving Average) algorithm
 */

export interface ReviewData {
  rating: number; // 1-5
  timestamp: Date;
  dealValue?: number; // USDC value of the deal
  verified: boolean; // Whether review is verified on-chain
  disputeResolved?: boolean; // If there was a dispute that was resolved
}

export interface ReputationFactors {
  baseScore: number;
  totalReviews: number;
  averageRating: number;
  recentActivity: number;
  dealSize: number;
  verifiedRatio: number;
  disputeRatio: number;
}

export interface BadgeRequirement {
  minReviews: number;
  minRating: number;
  minRecentDeals?: number;
  minDealValue?: number;
  maxDisputeRatio?: number;
  verifiedRatio?: number;
  daysActive?: number;
}

/**
 * Reputation calculation engine
 */
export class ReputationEngine {
  // Algorithm constants
  private static readonly DECAY_FACTOR = 0.95; // How much recent reviews matter more
  private static readonly MIN_REVIEWS_FOR_STABILITY = 5;
  private static readonly DEAL_SIZE_WEIGHT = 0.1;
  private static readonly VERIFICATION_BONUS = 0.1;
  private static readonly DISPUTE_PENALTY = 0.2;

  /**
   * Calculate comprehensive reputation score (0-5 scale)
   */
  static calculateReputationScore(reviews: ReviewData[]): ReputationFactors {
    if (reviews.length === 0) {
      return {
        baseScore: 0,
        totalReviews: 0,
        averageRating: 0,
        recentActivity: 0,
        dealSize: 0,
        verifiedRatio: 0,
        disputeRatio: 0,
      };
    }

    // Sort reviews by timestamp (newest first)
    const sortedReviews = reviews.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Calculate base metrics
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const verifiedCount = reviews.filter(r => r.verified).length;
    const verifiedRatio = verifiedCount / totalReviews;
    const disputeCount = reviews.filter(r => r.disputeResolved).length;
    const disputeRatio = disputeCount / totalReviews;

    // Calculate EWMA score (gives more weight to recent reviews)
    const ewmaScore = this.calculateEWMA(sortedReviews);

    // Calculate recent activity factor (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentReviews = reviews.filter(r => r.timestamp >= thirtyDaysAgo);
    const recentActivity = Math.min(recentReviews.length / 5, 1); // Normalize to 0-1

    // Calculate deal size factor
    const avgDealValue = reviews
      .filter(r => r.dealValue)
      .reduce((sum, r) => sum + (r.dealValue || 0), 0) / Math.max(1, reviews.filter(r => r.dealValue).length);
    const dealSize = Math.min(avgDealValue / 1000, 1); // Normalize to 0-1 (1000 USDC = max)

    // Apply bonuses and penalties
    let finalScore = ewmaScore;
    finalScore += verifiedRatio * this.VERIFICATION_BONUS;
    finalScore -= disputeRatio * this.DISPUTE_PENALTY;
    finalScore += dealSize * this.DEAL_SIZE_WEIGHT;

    // Stability adjustment for new providers
    if (totalReviews < this.MIN_REVIEWS_FOR_STABILITY) {
      const stabilityFactor = totalReviews / this.MIN_REVIEWS_FOR_STABILITY;
      finalScore = finalScore * stabilityFactor + 3.0 * (1 - stabilityFactor); // Default to 3.0 for new users
    }

    // Clamp to 0-5 range
    finalScore = Math.max(0, Math.min(5, finalScore));

    return {
      baseScore: finalScore,
      totalReviews,
      averageRating,
      recentActivity,
      dealSize,
      verifiedRatio,
      disputeRatio,
    };
  }

  /**
   * Calculate Exponentially Weighted Moving Average
   */
  private static calculateEWMA(sortedReviews: ReviewData[]): number {
    if (sortedReviews.length === 0) return 0;

    let weightedSum = 0;
    let weightSum = 0;
    let currentWeight = 1;

    for (const review of sortedReviews) {
      weightedSum += review.rating * currentWeight;
      weightSum += currentWeight;
      currentWeight *= this.DECAY_FACTOR;
    }

    return weightSum > 0 ? weightedSum / weightSum : 0;
  }

  /**
   * Check if user qualifies for specific badges
   */
  static checkBadgeEligibility(
    reviews: ReviewData[],
    userCreatedAt: Date,
    badgeType: string
  ): { eligible: boolean; reason?: string } {
    const reputation = this.calculateReputationScore(reviews);
    const daysSinceCreation = Math.floor((Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24));

    const requirements: Record<string, BadgeRequirement> = {
      VERIFIED_PROVIDER: {
        minReviews: 1,
        minRating: 3.0,
        verifiedRatio: 1.0, // Must have at least one verified review
      },
      TOP_RATED: {
        minReviews: 10,
        minRating: 4.8,
        maxDisputeRatio: 0.05,
      },
      QUICK_RESPONDER: {
        minReviews: 5,
        minRating: 4.0,
        minRecentDeals: 3, // 3 deals in last 30 days
      },
      RELIABLE: {
        minReviews: 15,
        minRating: 4.5,
        maxDisputeRatio: 0.1,
        daysActive: 30,
      },
      NEWCOMER: {
        minReviews: 1,
        minRating: 3.0,
        daysActive: 7,
      },
      EARLY_ADOPTER: {
        minReviews: 1,
        minRating: 3.0,
        daysActive: 1,
      },
      FREQUENT_CLIENT: {
        minReviews: 10, // As a client
        minRating: 4.0,
      },
      TRUSTED_ESCROW: {
        minReviews: 20,
        minRating: 4.7,
        minDealValue: 100, // Average deal > $100
        maxDisputeRatio: 0.02,
      },
    };

    const requirement = requirements[badgeType];
    if (!requirement) {
      return { eligible: false, reason: 'Unknown badge type' };
    }

    // Check minimum reviews
    if (reputation.totalReviews < requirement.minReviews) {
      return {
        eligible: false,
        reason: `Need at least ${requirement.minReviews} reviews (have ${reputation.totalReviews})`,
      };
    }

    // Check minimum rating
    if (reputation.baseScore < requirement.minRating) {
      return {
        eligible: false,
        reason: `Need rating of at least ${requirement.minRating} (have ${reputation.baseScore.toFixed(1)})`,
      };
    }

    // Check dispute ratio
    if (requirement.maxDisputeRatio && reputation.disputeRatio > requirement.maxDisputeRatio) {
      return {
        eligible: false,
        reason: `Too many disputes (${(reputation.disputeRatio * 100).toFixed(1)}% vs max ${(requirement.maxDisputeRatio * 100)}%)`,
      };
    }

    // Check verification ratio
    if (requirement.verifiedRatio && reputation.verifiedRatio < requirement.verifiedRatio) {
      return {
        eligible: false,
        reason: `Need ${(requirement.verifiedRatio * 100)}% verified reviews (have ${(reputation.verifiedRatio * 100).toFixed(1)}%)`,
      };
    }

    // Check days active
    if (requirement.daysActive && daysSinceCreation < requirement.daysActive) {
      return {
        eligible: false,
        reason: `Account must be ${requirement.daysActive} days old (${daysSinceCreation} days)`,
      };
    }

    // Check recent deals for quick responder
    if (requirement.minRecentDeals) {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentDeals = reviews.filter(r => r.timestamp >= thirtyDaysAgo).length;
      if (recentDeals < requirement.minRecentDeals) {
        return {
          eligible: false,
          reason: `Need ${requirement.minRecentDeals} deals in last 30 days (have ${recentDeals})`,
        };
      }
    }

    // Check average deal value
    if (requirement.minDealValue) {
      const avgDealValue = reviews
        .filter(r => r.dealValue)
        .reduce((sum, r) => sum + (r.dealValue || 0), 0) / Math.max(1, reviews.filter(r => r.dealValue).length);

      if (avgDealValue < requirement.minDealValue) {
        return {
          eligible: false,
          reason: `Average deal value must be $${requirement.minDealValue} (have $${avgDealValue.toFixed(2)})`,
        };
      }
    }

    return { eligible: true };
  }

  /**
   * Get reputation level based on score
   */
  static getReputationLevel(score: number): {
    level: string;
    color: string;
    description: string;
  } {
    if (score >= 4.8) {
      return {
        level: 'Exceptional',
        color: '#10B981', // emerald-500
        description: 'Outstanding service provider',
      };
    } else if (score >= 4.5) {
      return {
        level: 'Excellent',
        color: '#059669', // emerald-600
        description: 'Highly reliable provider',
      };
    } else if (score >= 4.0) {
      return {
        level: 'Very Good',
        color: '#3B82F6', // blue-500
        description: 'Dependable service provider',
      };
    } else if (score >= 3.5) {
      return {
        level: 'Good',
        color: '#6366F1', // indigo-500
        description: 'Solid service provider',
      };
    } else if (score >= 3.0) {
      return {
        level: 'Fair',
        color: '#F59E0B', // amber-500
        description: 'Developing service provider',
      };
    } else if (score >= 2.0) {
      return {
        level: 'Poor',
        color: '#EF4444', // red-500
        description: 'Needs improvement',
      };
    } else {
      return {
        level: 'Very Poor',
        color: '#DC2626', // red-600
        description: 'Significant issues reported',
      };
    }
  }

  /**
   * Generate reputation insights and recommendations
   */
  static generateInsights(reviews: ReviewData[]): {
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  } {
    const reputation = this.calculateReputationScore(reviews);
    const strengths: string[] = [];
    const improvements: string[] = [];
    const recommendations: string[] = [];

    // Analyze strengths
    if (reputation.baseScore >= 4.5) {
      strengths.push('Consistently high-quality service');
    }
    if (reputation.verifiedRatio >= 0.8) {
      strengths.push('High rate of verified transactions');
    }
    if (reputation.disputeRatio <= 0.05) {
      strengths.push('Very low dispute rate');
    }
    if (reputation.recentActivity >= 0.8) {
      strengths.push('Actively taking on new projects');
    }

    // Identify improvements
    if (reputation.baseScore < 4.0) {
      improvements.push('Focus on improving service quality');
    }
    if (reputation.disputeRatio > 0.1) {
      improvements.push('Work on reducing client disputes');
    }
    if (reputation.verifiedRatio < 0.5) {
      improvements.push('Encourage clients to verify transactions');
    }
    if (reputation.totalReviews < 10) {
      improvements.push('Build up review history');
    }

    // Make recommendations
    if (reputation.totalReviews < 5) {
      recommendations.push('Complete a few small projects to build initial reputation');
    }
    if (reputation.recentActivity < 0.3) {
      recommendations.push('Stay active to maintain visibility');
    }
    if (reputation.dealSize < 0.2) {
      recommendations.push('Consider taking on higher-value projects');
    }

    return { strengths, improvements, recommendations };
  }
}