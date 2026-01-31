// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CollegeDAO {
    IERC20 public voteToken;

    struct Proposal {
        string ipfsHash;
        uint256 amount;
        address payable recipient;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 deadline;
        bool executed;
    }

    Proposal[] public proposals;
    mapping(uint256 => mapping(address => bool)) public voted;

    event ProposalCreated(uint256 id, string ipfsHash, uint256 amount, address recipient, uint256 deadline);
    event Voted(uint256 id, address voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 id, bool success);

    constructor(address _voteToken) {
        voteToken = IERC20(_voteToken);
    }

    function createProposal(
        string memory _ipfsHash,
        uint256 _amount,
        address payable _recipient,
        uint256 _duration
    ) external {
        proposals.push(
            Proposal(_ipfsHash, _amount, _recipient, 0, 0, block.timestamp + _duration, false)
        );
        emit ProposalCreated(proposals.length - 1, _ipfsHash, _amount, _recipient, block.timestamp + _duration);
    }

    function vote(uint256 id, bool support) external {
        require(id < proposals.length, "Invalid proposal");
        Proposal storage p = proposals[id];
        require(block.timestamp <= p.deadline, "Voting closed");
        require(!voted[id][msg.sender], "Already voted");

        uint256 weight = voteToken.balanceOf(msg.sender);
        require(weight > 0, "No voting rights");

        voted[id][msg.sender] = true;
        
        if (support) {
            p.yesVotes += weight;
        } else {
            p.noVotes += weight;
        }
        
        emit Voted(id, msg.sender, support, weight);
    }

    function execute(uint256 id) external {
        Proposal storage p = proposals[id];
        require(block.timestamp > p.deadline, "Voting active");
        require(!p.executed, "Executed");
        
        p.executed = true;

        if (p.yesVotes > p.noVotes) {
            (bool success, ) = p.recipient.call{value: p.amount}("");
            require(success, "Transfer failed"); // Simple transfer
            emit ProposalExecuted(id, true);
        } else {
            emit ProposalExecuted(id, false);
        }
    }

    function getProposalsCount() external view returns (uint256) {
        return proposals.length;
    }

    receive() external payable {}
}
