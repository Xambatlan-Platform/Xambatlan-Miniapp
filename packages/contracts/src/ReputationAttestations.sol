// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ReputationAttestations
 * @dev Contract for managing reputation attestations in Xambatlán
 * @notice Stores on-chain reputation data and attestations for reviews
 */
contract ReputationAttestations is Ownable, Pausable, ReentrancyGuard {
    // Structs
    struct ReviewAttestation {
        bytes32 id;
        address from;
        address to;
        uint8 rating; // 1-5 stars
        bytes32 dealId;
        string ipfsHash; // IPFS hash of review content
        uint256 timestamp;
        bool verified;
    }

    struct UserReputation {
        uint256 totalReviews;
        uint256 totalRating;
        uint256 lastUpdated;
        bool exists;
    }

    // Events
    event ReviewAttested(
        bytes32 indexed attestationId,
        address indexed from,
        address indexed to,
        uint8 rating,
        bytes32 dealId
    );
    event ReputationUpdated(address indexed user, uint256 newScore, uint256 totalReviews);
    event AttestationVerified(bytes32 indexed attestationId, address indexed verifier);

    // State variables
    mapping(bytes32 => ReviewAttestation) public attestations;
    mapping(address => UserReputation) public userReputations;
    mapping(bytes32 => bool) public usedDealIds; // Prevent duplicate reviews for same deal

    uint256 public attestationCount;
    mapping(address => bool) public verifiers; // Authorized verifiers (backend services)

    // Errors
    error InvalidRating();
    error AttestationNotFound();
    error DealAlreadyReviewed();
    error NotVerifier();
    error AlreadyVerified();
    error SelfReview();

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Attest a review on-chain
     * @param attestationId Unique identifier for the attestation
     * @param to Address being reviewed
     * @param rating Rating given (1-5)
     * @param dealId Associated deal identifier
     * @param ipfsHash IPFS hash of review content
     */
    function attestReview(
        bytes32 attestationId,
        address to,
        uint8 rating,
        bytes32 dealId,
        string calldata ipfsHash
    ) external whenNotPaused nonReentrant {
        if (rating < 1 || rating > 5) revert InvalidRating();
        if (msg.sender == to) revert SelfReview();
        if (usedDealIds[dealId]) revert DealAlreadyReviewed();
        if (attestations[attestationId].from != address(0)) revert AttestationNotFound(); // Already exists

        // Create attestation
        attestations[attestationId] = ReviewAttestation({
            id: attestationId,
            from: msg.sender,
            to: to,
            rating: rating,
            dealId: dealId,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            verified: false
        });

        usedDealIds[dealId] = true;
        attestationCount++;

        emit ReviewAttested(attestationId, msg.sender, to, rating, dealId);

        // Update reputation
        _updateReputation(to, rating);
    }

    /**
     * @dev Verify an attestation (verifier only)
     * @param attestationId Attestation to verify
     */
    function verifyAttestation(bytes32 attestationId) external whenNotPaused {
        if (!verifiers[msg.sender]) revert NotVerifier();

        ReviewAttestation storage attestation = attestations[attestationId];
        if (attestation.from == address(0)) revert AttestationNotFound();
        if (attestation.verified) revert AlreadyVerified();

        attestation.verified = true;
        emit AttestationVerified(attestationId, msg.sender);
    }

    /**
     * @dev Internal function to update user reputation
     * @param user User to update
     * @param rating New rating to include
     */
    function _updateReputation(address user, uint8 rating) internal {
        UserReputation storage reputation = userReputations[user];

        if (!reputation.exists) {
            reputation.exists = true;
            reputation.totalReviews = 1;
            reputation.totalRating = rating;
        } else {
            reputation.totalReviews++;
            reputation.totalRating += rating;
        }

        reputation.lastUpdated = block.timestamp;

        // Calculate average (multiplied by 100 for precision)
        uint256 averageScore = (reputation.totalRating * 100) / reputation.totalReviews;

        emit ReputationUpdated(user, averageScore, reputation.totalReviews);
    }

    /**
     * @dev Get user's reputation score (scaled by 100)
     * @param user User address
     * @return score Average rating * 100, total reviews
     */
    function getReputationScore(address user) external view returns (uint256 score, uint256 reviews) {
        UserReputation memory reputation = userReputations[user];
        if (!reputation.exists || reputation.totalReviews == 0) {
            return (0, 0);
        }
        score = (reputation.totalRating * 100) / reputation.totalReviews;
        reviews = reputation.totalReviews;
    }

    /**
     * @dev Get attestation details
     * @param attestationId Attestation identifier
     * @return ReviewAttestation struct
     */
    function getAttestation(bytes32 attestationId) external view returns (ReviewAttestation memory) {
        return attestations[attestationId];
    }

    /**
     * @dev Check if a deal has been reviewed
     * @param dealId Deal identifier
     * @return bool True if already reviewed
     */
    function isDealReviewed(bytes32 dealId) external view returns (bool) {
        return usedDealIds[dealId];
    }

    /**
     * @dev Get total number of attestations
     * @return uint256 Total attestations count
     */
    function getTotalAttestations() external view returns (uint256) {
        return attestationCount;
    }

    // Admin functions
    function addVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = true;
    }

    function removeVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = false;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency function to correct reputation (admin only)
     * @param user User to update
     * @param totalRating New total rating
     * @param totalReviews New total review count
     */
    function adminUpdateReputation(
        address user,
        uint256 totalRating,
        uint256 totalReviews
    ) external onlyOwner {
        UserReputation storage reputation = userReputations[user];
        reputation.totalRating = totalRating;
        reputation.totalReviews = totalReviews;
        reputation.lastUpdated = block.timestamp;
        reputation.exists = true;

        uint256 averageScore = totalReviews > 0 ? (totalRating * 100) / totalReviews : 0;
        emit ReputationUpdated(user, averageScore, totalReviews);
    }
}