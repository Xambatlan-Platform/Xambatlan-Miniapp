// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/ProfileSBT.sol";
import "../src/Escrow.sol";
import "../src/ReputationAttestations.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address feeRecipient = vm.envOr("FEE_RECIPIENT", deployer);

        console.log("Deploying contracts with account:", deployer);
        console.log("Fee recipient:", feeRecipient);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy ProfileSBT
        ProfileSBT profileSBT = new ProfileSBT(deployer);
        console.log("ProfileSBT deployed to:", address(profileSBT));

        // Deploy Escrow
        Escrow escrow = new Escrow(deployer, feeRecipient);
        console.log("Escrow deployed to:", address(escrow));

        // Deploy ReputationAttestations
        ReputationAttestations reputation = new ReputationAttestations(deployer);
        console.log("ReputationAttestations deployed to:", address(reputation));

        // Add deployer as verifier for reputation contract
        reputation.addVerifier(deployer);

        // Add USDC as supported token (mock address for testnet)
        address usdcAddress = vm.envOr("USDC_ADDRESS", address(0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238)); // Sepolia USDC
        if (usdcAddress != address(0)) {
            escrow.addSupportedToken(usdcAddress);
            console.log("Added USDC as supported token:", usdcAddress);
        }

        vm.stopBroadcast();

        // Save deployment addresses to file
        string memory json = string(
            abi.encodePacked(
                '{\n',
                '  "ProfileSBT": "', vm.toString(address(profileSBT)), '",\n',
                '  "Escrow": "', vm.toString(address(escrow)), '",\n',
                '  "ReputationAttestations": "', vm.toString(address(reputation)), '",\n',
                '  "deployer": "', vm.toString(deployer), '",\n',
                '  "network": "', vm.envOr("NETWORK", "localhost"), '",\n',
                '  "blockNumber": ', vm.toString(block.number), '\n',
                '}'
            )
        );

        vm.writeFile("./deployments.json", json);
        console.log("Deployment addresses saved to deployments.json");
    }
}

// Script for local testing with mock USDC
contract DeployLocalScript is Script {
    function run() external {
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80; // anvil account 0
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying to local network with account:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        // Deploy a mock USDC token for testing
        MockUSDC usdc = new MockUSDC();
        console.log("Mock USDC deployed to:", address(usdc));

        // Deploy main contracts
        ProfileSBT profileSBT = new ProfileSBT(deployer);
        Escrow escrow = new Escrow(deployer, deployer);
        ReputationAttestations reputation = new ReputationAttestations(deployer);

        // Setup
        escrow.addSupportedToken(address(usdc));
        reputation.addVerifier(deployer);

        console.log("ProfileSBT:", address(profileSBT));
        console.log("Escrow:", address(escrow));
        console.log("Reputation:", address(reputation));

        vm.stopBroadcast();
    }
}

// Mock USDC for local testing
contract MockUSDC {
    string public name = "Mock USDC";
    string public symbol = "USDC";
    uint8 public decimals = 6;
    uint256 public totalSupply = 1000000 * 10**6; // 1M USDC

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        return true;
    }

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }
}