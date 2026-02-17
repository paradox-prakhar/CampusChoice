const hre = require("hardhat");
const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    console.log("Checking environment...");
    const key = process.env.DEPLOYER_PRIVATE_KEY;
    if (!key) {
        console.error("❌ DEPLOYER_PRIVATE_KEY not found in .env");
        return;
    }
    console.log("✅ DEPLOYER_PRIVATE_KEY found (length: " + key.length + ")");

    const rpc = process.env.QUAI_TESTNET_RPC || "https://rpc.quai.network/cyprus1";
    console.log("Checking RPC: " + rpc);

    try {
        const provider = new ethers.JsonRpcProvider(rpc);
        const network = await provider.getNetwork();
        console.log("✅ Connected to network. ChainId: " + network.chainId);
        
        const wallet = new ethers.Wallet(key, provider);
        console.log("✅ Wallet created. Address: " + wallet.address);
        
        const balance = await provider.getBalance(wallet.address);
        console.log("✅ Balance: " + ethers.formatEther(balance) + " QUAI");
    } catch (e) {
        console.error("❌ Error during diagnosis:");
        console.error(e);
    }
}

main().catch(console.error);
