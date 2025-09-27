// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ProfileSBT
 * @dev Soulbound Token (non-transferable NFT) for user profiles in Xambatlán
 * @notice This contract manages user profile NFTs that cannot be transferred
 */
contract ProfileSBT is ERC721, Ownable, Pausable, ReentrancyGuard {
    // Events
    event ProfileMinted(address indexed to, uint256 indexed tokenId, bytes32 profileHash);
    event ProfileHashUpdated(uint256 indexed tokenId, bytes32 oldHash, bytes32 newHash);

    // State variables
    uint256 private _nextTokenId = 1;
    mapping(uint256 => bytes32) public profileHashes;
    mapping(address => uint256) public userTokens;
    mapping(bytes32 => bool) public usedHashes;

    // Errors
    error AlreadyMinted();
    error InvalidHash();
    error NotTokenOwner();
    error HashAlreadyUsed();
    error TransferNotAllowed();

    constructor(address initialOwner) ERC721("Xambatlán Profile", "XAMP") Ownable(initialOwner) {}

    /**
     * @dev Mint a profile SBT to a user
     * @param to Address to mint the token to
     * @param profileHash IPFS hash or content hash of the profile metadata
     */
    function mintProfile(address to, bytes32 profileHash) external onlyOwner whenNotPaused nonReentrant {
        if (userTokens[to] != 0) revert AlreadyMinted();
        if (profileHash == bytes32(0)) revert InvalidHash();
        if (usedHashes[profileHash]) revert HashAlreadyUsed();

        uint256 tokenId = _nextTokenId++;
        userTokens[to] = tokenId;
        profileHashes[tokenId] = profileHash;
        usedHashes[profileHash] = true;

        _safeMint(to, tokenId);
        emit ProfileMinted(to, tokenId, profileHash);
    }

    /**
     * @dev Update the profile hash for a token
     * @param tokenId Token ID to update
     * @param newHash New profile hash
     */
    function setProfileHash(uint256 tokenId, bytes32 newHash) external onlyOwner whenNotPaused {
        if (newHash == bytes32(0)) revert InvalidHash();
        if (usedHashes[newHash]) revert HashAlreadyUsed();

        bytes32 oldHash = profileHashes[tokenId];
        profileHashes[tokenId] = newHash;
        usedHashes[oldHash] = false;
        usedHashes[newHash] = true;

        emit ProfileHashUpdated(tokenId, oldHash, newHash);
    }

    /**
     * @dev Get the profile hash for a token
     * @param tokenId Token ID to query
     * @return The profile hash
     */
    function getProfileHash(uint256 tokenId) external view returns (bytes32) {
        return profileHashes[tokenId];
    }

    /**
     * @dev Get the token ID for a user
     * @param user User address to query
     * @return The token ID (0 if no token)
     */
    function getUserTokenId(address user) external view returns (uint256) {
        return userTokens[user];
    }

    /**
     * @dev Check if a user has a profile token
     * @param user User address to check
     * @return True if user has a token
     */
    function hasProfile(address user) external view returns (bool) {
        return userTokens[user] != 0;
    }

    /**
     * @dev Get total number of profiles minted
     * @return The total supply
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    // Override transfer functions to make tokens non-transferable (soulbound)
    function transferFrom(address, address, uint256) public pure override {
        revert TransferNotAllowed();
    }

    function safeTransferFrom(address, address, uint256) public pure override {
        revert TransferNotAllowed();
    }

    function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
        revert TransferNotAllowed();
    }

    // Admin functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Emergency function to update profile hash by token owner (in case of bugs)
     * @param newHash New profile hash
     */
    function updateMyProfileHash(bytes32 newHash) external whenNotPaused {
        uint256 tokenId = userTokens[msg.sender];
        if (tokenId == 0) revert NotTokenOwner();
        if (newHash == bytes32(0)) revert InvalidHash();
        if (usedHashes[newHash]) revert HashAlreadyUsed();

        bytes32 oldHash = profileHashes[tokenId];
        profileHashes[tokenId] = newHash;
        usedHashes[oldHash] = false;
        usedHashes[newHash] = true;

        emit ProfileHashUpdated(tokenId, oldHash, newHash);
    }

    // The following functions are overrides required by Solidity
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}