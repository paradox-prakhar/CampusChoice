// scripts/check-network.js
// ──────────────────────────────────────────────
// Verify which Quai network you are connected to.
//
// Usage:
//   npx hardhat run scripts/check-network.js --network quaiTestnet
//   npx hardhat run scripts/check-network.js --network quaiMainnet
// ──────────────────────────────────────────────
const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const network = await hre.ethers.provider.getNetwork();

  console.log("══════════════════════════════════════════════");
  console.log("  NETWORK VERIFICATION");
  console.log("══════════════════════════════════════════════");
  console.log("  Hardhat network name :", hre.network.name);
  console.log("  Chain ID             :", network.chainId.toString());
  console.log("  RPC URL              :", hre.network.config.url || "local");
  console.log("──────────────────────────────────────────────");
  console.log("  Your wallet address  :", signer.address);

  const balance = await hre.ethers.provider.getBalance(signer.address);
  console.log("  Wallet balance       :", hre.ethers.formatEther(balance), "QUAI");
  console.log("══════════════════════════════════════════════");

  // Quick network identification
  const name = hre.network.name;
  if (name === "quaiTestnet") {
    console.log("\n  ✅ You are on QUAI TESTNET (Colosseum)");
    console.log("  🔗 Explorer: https://cyprus1.colosseum.quaiscan.io");
  } else if (name === "quaiMainnet") {
    console.log("\n  ✅ You are on QUAI MAINNET (Golden Age)");
    console.log("  🔗 Explorer: https://cyprus1.quaiscan.io");
  } else if (name === "localhost" || name === "hardhat") {
    console.log("\n  ℹ️  You are on a LOCAL network (Hardhat)");
  } else {
    console.log("\n  ⚠️  Unknown network:", name);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
