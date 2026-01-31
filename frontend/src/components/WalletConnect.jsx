import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ onConnect }) => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState("0");

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                const bal = await provider.getBalance(address);

                setAccount(address);
                setBalance(ethers.formatEther(bal));
                onConnect(signer, address);
            } catch (err) {
                console.error("Error connecting wallet:", err);
                alert("Failed to connect wallet.");
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    return (
        <div className="card flex-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}></div>
                <div>
                    <h3 style={{ margin: 0 }}>College DAO</h3>
                    <span style={{ fontSize: '0.8em', color: 'var(--color-text-dim)' }}>Tech Event Funding</span>
                </div>
            </div>

            {account ? (
                <div style={{ textAlign: 'right' }}>
                    <div className="badge badge-green" style={{ marginBottom: '4px', display: 'inline-block' }}>Connected</div>
                    <div style={{ fontSize: '0.9em', fontFamily: 'monospace' }}>
                        {account.slice(0, 6)}...{account.slice(-4)}
                    </div>
                    <div style={{ fontSize: '0.8em', color: 'var(--color-text-dim)' }}>{parseFloat(balance).toFixed(4)} ETH</div>
                </div>
            ) : (
                <button onClick={connectWallet}>Connect Wallet</button>
            )}
        </div>
    );
};

export default WalletConnect;
