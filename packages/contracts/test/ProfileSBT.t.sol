// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/ProfileSBT.sol";

contract ProfileSBTTest is Test {
    ProfileSBT public profileSBT;
    address public owner;
    address public user1;
    address public user2;
    bytes32 public profileHash1;
    bytes32 public profileHash2;

    function setUp() public {
        owner = makeAddr("owner");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        profileHash1 = keccak256("profile1");
        profileHash2 = keccak256("profile2");

        vm.prank(owner);
        profileSBT = new ProfileSBT(owner);
    }

    function testMintProfile() public {
        vm.prank(owner);
        profileSBT.mintProfile(user1, profileHash1);

        assertEq(profileSBT.getUserTokenId(user1), 1);
        assertEq(profileSBT.getProfileHash(1), profileHash1);
        assertEq(profileSBT.hasProfile(user1), true);
        assertEq(profileSBT.ownerOf(1), user1);
        assertEq(profileSBT.totalSupply(), 1);
    }

    function testCannotMintDuplicate() public {
        vm.prank(owner);
        profileSBT.mintProfile(user1, profileHash1);

        vm.prank(owner);
        vm.expectRevert(ProfileSBT.AlreadyMinted.selector);
        profileSBT.mintProfile(user1, profileHash2);
    }

    function testCannotMintInvalidHash() public {
        vm.prank(owner);
        vm.expectRevert(ProfileSBT.InvalidHash.selector);
        profileSBT.mintProfile(user1, bytes32(0));
    }

    function testCannotMintUsedHash() public {
        vm.prank(owner);
        profileSBT.mintProfile(user1, profileHash1);

        vm.prank(owner);
        vm.expectRevert(ProfileSBT.HashAlreadyUsed.selector);
        profileSBT.mintProfile(user2, profileHash1);
    }

    function testSetProfileHash() public {
        vm.prank(owner);
        profileSBT.mintProfile(user1, profileHash1);

        vm.prank(owner);
        profileSBT.setProfileHash(1, profileHash2);

        assertEq(profileSBT.getProfileHash(1), profileHash2);
    }

    function testUpdateMyProfileHash() public {
        vm.prank(owner);
        profileSBT.mintProfile(user1, profileHash1);

        vm.prank(user1);
        profileSBT.updateMyProfileHash(profileHash2);

        assertEq(profileSBT.getProfileHash(1), profileHash2);
    }

    function testCannotTransfer() public {
        vm.prank(owner);
        profileSBT.mintProfile(user1, profileHash1);

        vm.prank(user1);
        vm.expectRevert(ProfileSBT.TransferNotAllowed.selector);
        profileSBT.transferFrom(user1, user2, 1);

        vm.prank(user1);
        vm.expectRevert(ProfileSBT.TransferNotAllowed.selector);
        profileSBT.safeTransferFrom(user1, user2, 1);
    }

    function testOnlyOwnerCanMint() public {
        vm.prank(user1);
        vm.expectRevert();
        profileSBT.mintProfile(user1, profileHash1);
    }

    function testPauseUnpause() public {
        vm.prank(owner);
        profileSBT.pause();

        vm.prank(owner);
        vm.expectRevert();
        profileSBT.mintProfile(user1, profileHash1);

        vm.prank(owner);
        profileSBT.unpause();

        vm.prank(owner);
        profileSBT.mintProfile(user1, profileHash1);

        assertEq(profileSBT.hasProfile(user1), true);
    }
}