# EventDAO – Quai Network DAO Smart Contract

A fully on-chain DAO for **event proposal creation, voting, and finalization**, built in Solidity and designed for deployment on [Quai Network](https://qu.ai).

---

## Table of Contents

1. [Architecture](#architecture)
2. [Quick Start](#quick-start)
3. [Deployment](#deployment)
4. [Frontend Integration](#frontend-integration)
5. [Scalability on Quai](#scalability-on-quai)

---

## Architecture

```
┌──────────────┐         ┌──────────────────┐
│  Frontend    │ ◄─────► │  EventDAO.sol     │
│  (ethers.js) │  txns   │  (Quai Network)   │
└──────────────┘         └──────────────────┘
       │                         │
       │  MetaMask / Pelagus     │  On-chain state
       └─────────────────────────┘
```

**Single source of truth** — all governance logic lives on-chain.  
Proposal descriptions are stored as **IPFS CIDs** to keep gas costs minimal.

### Contract Flow

1. **Create Proposal** → `createProposal(title, ipfsCID, votingDuration)`
2. **Vote** → `vote(proposalId, support)` — 1 vote per wallet, YES or NO
3. **Finalize** → `finalizeProposal(proposalId)` — callable by anyone after deadline
4. **Read** → `getProposal()`, `getProposalCount()`, `hasVoted()`

---

## Quick Start

```bash
cd contracts

# Install dependencies
npm install

# Compile
npx hardhat compile

# Run tests
npx hardhat test
```

---

## Deployment

### 1. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your deployer private key (exported from MetaMask or Pelagus):

```
DEPLOYER_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
```

> ⚠️ **Never commit `.env` to version control.**

### 2. Deploy to Quai Testnet

```bash
npx hardhat run scripts/deploy.js --network quaiTestnet
```

### 3. Deploy to Quai Mainnet

```bash
npx hardhat run scripts/deploy.js --network quaiMainnet
```

The deployment script prints the contract address — save it for your frontend.

---

## Frontend Integration

### Connecting with ethers.js

```javascript
import { ethers } from "ethers";
import EventDAO_ABI from "./artifacts/contracts/EventDAO.sol/EventDAO.json";

// Works with both MetaMask and Pelagus (both inject window.ethereum)
const provider = new ethers.BrowserProvider(window.ethereum);
const signer   = await provider.getSigner();

const CONTRACT_ADDRESS = "0x..."; // deployed address
const dao = new ethers.Contract(CONTRACT_ADDRESS, EventDAO_ABI.abi, signer);
```

### Creating a Proposal

```javascript
const tx = await dao.createProposal(
  "Campus Music Festival",        // title
  "QmXnnyufdzAWL5CqZ2RnSNg...",  // IPFS CID
  86400                            // 1 day in seconds
);
await tx.wait();
```

### Casting a Vote

```javascript
// true = YES, false = NO
const tx = await dao.vote(1, true);
await tx.wait();
```

### Reading Data

```javascript
const proposal = await dao.getProposal(1);
const count    = await dao.getProposalCount();
const voted    = await dao.hasVoted(1, walletAddress);
```

### Listening to Events

```javascript
dao.on("ProposalCreated", (id, proposer, title, ipfsCID, voteEndTime) => {
  console.log(`New proposal #${id}: ${title}`);
});

dao.on("VoteCast", (proposalId, voter, support) => {
  console.log(`Vote on #${proposalId} by ${voter}: ${support ? "YES" : "NO"}`);
});

dao.on("ProposalFinalized", (proposalId, status) => {
  const labels = ["Active", "Approved", "Rejected"];
  console.log(`Proposal #${proposalId} finalized: ${labels[status]}`);
});
```

---

## Scalability on Quai

Quai Network offers unique advantages for this DAO:

| Feature | Benefit |
|---|---|
| **Multi-chain (zone sharding)** | Deploy to a single zone (e.g. Cyprus-1) today; scale to multiple zones as user base grows. Each zone processes transactions in parallel, eliminating single-chain bottlenecks. |
| **Merged mining** | Security is shared across all zones, so even a single-zone deployment inherits network-wide hash power. |
| **Low gas fees** | Quai's sharded architecture keeps per-zone load low, resulting in consistently low transaction fees — ideal for high-frequency voting. |
| **EVM compatibility** | Standard Solidity + Hardhat tooling works out of the box; no proprietary SDK required. |
| **Cross-zone messaging** (future) | When Quai enables native cross-zone calls, the DAO can accept votes from wallets on any zone without bridging. |

### Deployment Recommendations

- **Testnet first** — Use the Colosseum testnet (Cyprus-1) for all testing.
- **Single zone** — Start on one zone; the contract is portable to any zone.
- **IPFS for descriptions** — Keeps on-chain storage minimal and gas costs predictable.
- **No upgradeability** — The contract is immutable by design, aligning with trustless DAO principles.

---

## Security Considerations

- ✅ One vote per wallet per proposal (mapping-enforced)
- ✅ Voting deadline checked via `block.timestamp`
- ✅ No `onlyOwner` or admin functions — fully decentralized
- ✅ No `selfdestruct`, no `delegatecall`
- ✅ No upgradeability proxy — what you deploy is what runs
- ✅ Solidity 0.8.x built-in overflow/underflow protection

---

## License

MIT
