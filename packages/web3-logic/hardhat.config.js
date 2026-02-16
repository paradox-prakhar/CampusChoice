require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    // ─── Quai Network Testnet (Colosseum – Cyprus-1 zone) ───
    quaiTestnet: {
      url: process.env.QUAI_TESTNET_RPC || "https://rpc.cyprus1.colosseum.quaiscan.io",
      chainId: parseInt(process.env.QUAI_TESTNET_CHAIN_ID || "9000", 10),
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
    },

    // ─── Quai Network Mainnet (Golden Age – Cyprus-1 zone) ───
    quaiMainnet: {
      url: process.env.QUAI_MAINNET_RPC || "https://rpc.cyprus1.quaiscan.io",
      chainId: parseInt(process.env.QUAI_MAINNET_CHAIN_ID || "9000", 10),
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
    },

    // ─── Local development ───
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
