import { ethers } from 'ethers';
import { EventDAOABI, getEventDAOAddress } from '@vibecraft/web3-logic';

// ── Types ──
export interface OnChainProposal {
  id: number;
  proposer: string;
  title: string;
  ipfsCID: string;
  yesVotes: number;
  noVotes: number;
  voteEndTime: number;   // unix seconds
  finalized: boolean;
  status: 'Active' | 'Approved' | 'Rejected';
}

// ── Config ──
const NETWORK = (import.meta.env.VITE_NETWORK || 'quai-testnet') as 'quai-testnet' | 'quai-mainnet' | 'localhost';
const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://orchard.rpc.quai.network/cyprus1';
const CONTRACT_ADDRESS = getEventDAOAddress(NETWORK);

// ── Read-only provider (no wallet needed) ──
function getReadProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(RPC_URL);
}

function getReadContract(): ethers.Contract {
  return new ethers.Contract(CONTRACT_ADDRESS, EventDAOABI, getReadProvider());
}

// ── Write contract (needs signer) ──
async function getWriteContract(signer: ethers.Signer): Promise<ethers.Contract> {
  return new ethers.Contract(CONTRACT_ADDRESS, EventDAOABI, signer);
}

// ═══════════════════════════════════════
//  READ FUNCTIONS (no wallet required)
// ═══════════════════════════════════════

export async function getProposalCount(): Promise<number> {
  const contract = getReadContract();
  const count = await contract.getProposalCount();
  return Number(count);
}

export async function getProposal(id: number): Promise<OnChainProposal> {
  const contract = getReadContract();
  const p = await contract.getProposal(id);
  const statusMap = ['Active', 'Approved', 'Rejected'] as const;
  return {
    id: Number(p.id),
    proposer: p.proposer,
    title: p.title,
    ipfsCID: p.ipfsCID,
    yesVotes: Number(p.yesVotes),
    noVotes: Number(p.noVotes),
    voteEndTime: Number(p.voteEndTime),
    finalized: p.finalized,
    status: statusMap[Number(p.status)] || 'Active',
  };
}

export async function getAllProposals(): Promise<OnChainProposal[]> {
  const count = await getProposalCount();
  if (count === 0) return [];

  const promises: Promise<OnChainProposal>[] = [];
  for (let i = 1; i <= count; i++) {
    promises.push(getProposal(i));
  }
  return Promise.all(promises);
}

export async function hasVoted(proposalId: number, voterAddress: string): Promise<boolean> {
  const contract = getReadContract();
  return contract.hasVoted(proposalId, voterAddress);
}

// ═══════════════════════════════════════
//  WRITE FUNCTIONS (wallet signer needed)
// ═══════════════════════════════════════

export async function createProposal(
  signer: ethers.Signer,
  title: string,
  ipfsCID: string,
  votingDurationSeconds: number
): Promise<ethers.ContractTransactionReceipt | null> {
  const contract = await getWriteContract(signer);
  const tx = await contract.createProposal(title, ipfsCID, votingDurationSeconds);
  return tx.wait();
}

export async function vote(
  signer: ethers.Signer,
  proposalId: number,
  support: boolean
): Promise<ethers.ContractTransactionReceipt | null> {
  const contract = await getWriteContract(signer);
  const tx = await contract.vote(proposalId, support);
  return tx.wait();
}

export async function finalizeProposal(
  signer: ethers.Signer,
  proposalId: number
): Promise<ethers.ContractTransactionReceipt | null> {
  const contract = await getWriteContract(signer);
  const tx = await contract.finalizeProposal(proposalId);
  return tx.wait();
}
