const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const GovernanceToken = await hre.ethers.getContractFactory("GovernanceToken");
    const token = await GovernanceToken.deploy();
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("GovernanceToken deployed to:", tokenAddress);

    const CollegeDAO = await hre.ethers.getContractFactory("CollegeDAO");
    const dao = await CollegeDAO.deploy(tokenAddress);
    await dao.waitForDeployment();
    const daoAddress = await dao.getAddress();
    console.log("CollegeDAO deployed to:", daoAddress);

    console.log("----------------------------------------------------");
    console.log("TOKEN_ADDRESS:", tokenAddress);
    console.log("DAO_ADDRESS:", daoAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
