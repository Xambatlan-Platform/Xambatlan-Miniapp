// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Escrow
 * @dev Escrow contract for Xambatlán deal management
 * @notice Handles escrowed payments between clients and providers
 */
contract Escrow is Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Structs
    struct Deal {
        bytes32 id;
        address client;
        address provider;
        address token;
        uint256 amount;
        uint256 expiry;
        DealStatus status;
        bool clientConfirmed;
        bool providerConfirmed;
        uint256 createdAt;
    }

    enum DealStatus {
        ACTIVE,
        COMPLETED,
        CANCELLED,
        DISPUTED
    }

    // Events
    event DealCreated(
        bytes32 indexed dealId,
        address indexed client,
        address indexed provider,
        address token,
        uint256 amount,
        uint256 expiry
    );
    event DealCompleted(bytes32 indexed dealId, address indexed winner);
    event DealCancelled(bytes32 indexed dealId, string reason);
    event DealDisputed(bytes32 indexed dealId, address indexed disputer);
    event DisputeResolved(bytes32 indexed dealId, uint256 clientAmount, uint256 providerAmount);
    event ConfirmationGiven(bytes32 indexed dealId, address indexed confirmer);

    // State variables
    mapping(bytes32 => Deal) public deals;
    mapping(address => bool) public supportedTokens;

    uint256 public platformFeePercentage = 250; // 2.5% = 250 basis points
    address public feeRecipient;

    // Errors
    error DealNotFound();
    error DealNotActive();
    error DealExpired();
    error DealNotExpired();
    error NotParticipant();
    error AlreadyConfirmed();
    error InsufficientAmount();
    error UnsupportedToken();
    error InvalidExpiry();
    error InvalidFeePercentage();
    error TransferFailed();

    constructor(address initialOwner, address _feeRecipient) Ownable(initialOwner) {
        feeRecipient = _feeRecipient;
    }

    /**
     * @dev Create a new escrowed deal
     * @param dealId Unique identifier for the deal
     * @param provider Address of the service provider
     * @param token ERC20 token contract address
     * @param amount Amount to escrow
     * @param expiry Timestamp when deal expires
     */
    function create(
        bytes32 dealId,
        address provider,
        address token,
        uint256 amount,
        uint256 expiry
    ) external payable whenNotPaused nonReentrant {
        if (deals[dealId].id != bytes32(0)) revert DealNotFound(); // Deal already exists
        if (amount == 0) revert InsufficientAmount();
        if (expiry <= block.timestamp) revert InvalidExpiry();
        if (!supportedTokens[token]) revert UnsupportedToken();

        // Transfer tokens to escrow
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        deals[dealId] = Deal({
            id: dealId,
            client: msg.sender,
            provider: provider,
            token: token,
            amount: amount,
            expiry: expiry,
            status: DealStatus.ACTIVE,
            clientConfirmed: false,
            providerConfirmed: false,
            createdAt: block.timestamp
        });

        emit DealCreated(dealId, msg.sender, provider, token, amount, expiry);
    }

    /**
     * @dev Confirm deal completion (mutual confirmation required)
     * @param dealId Deal identifier
     */
    function confirm(bytes32 dealId) external whenNotPaused {
        Deal storage deal = deals[dealId];
        if (deal.id == bytes32(0)) revert DealNotFound();
        if (deal.status != DealStatus.ACTIVE) revert DealNotActive();
        if (block.timestamp > deal.expiry) revert DealExpired();

        if (msg.sender == deal.client) {
            if (deal.clientConfirmed) revert AlreadyConfirmed();
            deal.clientConfirmed = true;
        } else if (msg.sender == deal.provider) {
            if (deal.providerConfirmed) revert AlreadyConfirmed();
            deal.providerConfirmed = true;
        } else {
            revert NotParticipant();
        }

        emit ConfirmationGiven(dealId, msg.sender);

        // If both parties confirmed, release funds
        if (deal.clientConfirmed && deal.providerConfirmed) {
            _releaseFunds(dealId);
        }
    }

    /**
     * @dev Release funds to provider (mutual confirmation or admin action)
     * @param dealId Deal identifier
     */
    function release(bytes32 dealId) external whenNotPaused {
        Deal storage deal = deals[dealId];
        if (deal.id == bytes32(0)) revert DealNotFound();
        if (deal.status != DealStatus.ACTIVE) revert DealNotActive();

        // Only allow release if both confirmed or if admin overrides
        if (!(deal.clientConfirmed && deal.providerConfirmed) && msg.sender != owner()) {
            revert NotParticipant();
        }

        _releaseFunds(dealId);
    }

    /**
     * @dev Cancel a deal and refund client
     * @param dealId Deal identifier
     * @param reason Cancellation reason
     */
    function cancel(bytes32 dealId, string calldata reason) external whenNotPaused {
        Deal storage deal = deals[dealId];
        if (deal.id == bytes32(0)) revert DealNotFound();
        if (deal.status != DealStatus.ACTIVE) revert DealNotActive();

        // Allow cancellation by participants or admin, or if expired
        bool canCancel = msg.sender == deal.client ||
                        msg.sender == deal.provider ||
                        msg.sender == owner() ||
                        block.timestamp > deal.expiry;

        if (!canCancel) revert NotParticipant();

        deal.status = DealStatus.CANCELLED;

        // Refund client
        IERC20(deal.token).safeTransfer(deal.client, deal.amount);

        emit DealCancelled(dealId, reason);
    }

    /**
     * @dev Open a dispute for a deal
     * @param dealId Deal identifier
     */
    function dispute(bytes32 dealId) external whenNotPaused {
        Deal storage deal = deals[dealId];
        if (deal.id == bytes32(0)) revert DealNotFound();
        if (deal.status != DealStatus.ACTIVE) revert DealNotActive();
        if (msg.sender != deal.client && msg.sender != deal.provider) revert NotParticipant();

        deal.status = DealStatus.DISPUTED;
        emit DealDisputed(dealId, msg.sender);
    }

    /**
     * @dev Resolve a dispute (admin only)
     * @param dealId Deal identifier
     * @param splitBps Basis points (0-10000) to give to provider, rest goes to client
     */
    function resolve(bytes32 dealId, uint256 splitBps) external onlyOwner whenNotPaused {
        if (splitBps > 10000) revert InvalidFeePercentage();

        Deal storage deal = deals[dealId];
        if (deal.id == bytes32(0)) revert DealNotFound();
        if (deal.status != DealStatus.DISPUTED) revert DealNotActive();

        deal.status = DealStatus.COMPLETED;

        uint256 providerAmount = (deal.amount * splitBps) / 10000;
        uint256 clientAmount = deal.amount - providerAmount;

        if (providerAmount > 0) {
            IERC20(deal.token).safeTransfer(deal.provider, providerAmount);
        }
        if (clientAmount > 0) {
            IERC20(deal.token).safeTransfer(deal.client, clientAmount);
        }

        emit DisputeResolved(dealId, clientAmount, providerAmount);
    }

    /**
     * @dev Internal function to release funds to provider
     * @param dealId Deal identifier
     */
    function _releaseFunds(bytes32 dealId) internal {
        Deal storage deal = deals[dealId];
        deal.status = DealStatus.COMPLETED;

        uint256 platformFee = (deal.amount * platformFeePercentage) / 10000;
        uint256 providerAmount = deal.amount - platformFee;

        // Transfer to provider
        IERC20(deal.token).safeTransfer(deal.provider, providerAmount);

        // Transfer platform fee
        if (platformFee > 0) {
            IERC20(deal.token).safeTransfer(feeRecipient, platformFee);
        }

        emit DealCompleted(dealId, deal.provider);
    }

    // Admin functions
    function addSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = true;
    }

    function removeSupportedToken(address token) external onlyOwner {
        supportedTokens[token] = false;
    }

    function setPlatformFee(uint256 _platformFeePercentage) external onlyOwner {
        if (_platformFeePercentage > 1000) revert InvalidFeePercentage(); // Max 10%
        platformFeePercentage = _platformFeePercentage;
    }

    function setFeeRecipient(address _feeRecipient) external onlyOwner {
        feeRecipient = _feeRecipient;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // View functions
    function getDeal(bytes32 dealId) external view returns (Deal memory) {
        return deals[dealId];
    }

    function isDealActive(bytes32 dealId) external view returns (bool) {
        Deal memory deal = deals[dealId];
        return deal.status == DealStatus.ACTIVE && block.timestamp <= deal.expiry;
    }

    function getDealStatus(bytes32 dealId) external view returns (DealStatus) {
        return deals[dealId].status;
    }
}