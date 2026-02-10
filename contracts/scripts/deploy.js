// scripts/deploy.js
// ──────────────────────────────────────────────
// Deploys the EventDAO contract to the configured network.
//
// Usage:
//   npx hardhat run scripts/deploy.js --network quaiTestnet
//   npx hardhat run scripts/deploy.js --network quaiMainnet
//   npx hardhat run scripts/deploy.js --network localhost
// ──────────────────────────────────────────────
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying EventDAO with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "QUAI");

  const EventDAO = await hre.ethers.getContractFactory("EventDAO");
  const eventDAO = await EventDAO.deploy();
  await eventDAO.waitForDeployment();

  const deployedAddress = await eventDAO.getAddress();
  console.log("──────────────────────────────────────────────");
  console.log("EventDAO deployed to:", deployedAddress);
  console.log("Network:", hre.network.name);
  console.log("──────────────────────────────────────────────");
  console.log("\nSave this address in your frontend .env file:");
  console.log(`VITE_EVENT_DAO_ADDRESS=${deployedAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
