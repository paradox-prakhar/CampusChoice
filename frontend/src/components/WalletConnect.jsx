import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet, LogOut, ChevronRight, Zap } from 'lucide-react';

const WalletConnect = ({ onConnect, variant = 'hero' }) => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState("0");
    const [isConnecting, setIsConnecting] = useState(false);

    const connectWallet = async () => {
        setIsConnecting(true);
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
            }
        } else {
            alert("Please install MetaMask!");
        }
        setIsConnecting(false);
    };

    return (
        <div className={variant === 'navbar' ? 'w-auto' : 'w-full'}>
            {account ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-2 px-4 flex items-center gap-3 shadow-lg">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                        {account.slice(2, 4)}
                    </div>
                    <div className="text-left hidden md:block">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-white text-sm font-medium">{account.slice(0, 6)}...</span>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={connectWallet}
                    disabled={isConnecting}
                    className={`
                        group relative flex items-center gap-2 font-bold transition-all duration-300 overflow-hidden
                        ${variant === 'navbar'
                            ? 'px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm shadow-md'
                            : 'px-8 py-4 bg-white text-slate-900 rounded-full text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105'
                        }
                    `}
                >
                    {isConnecting ? (
                        <>Connecting...</>
                    ) : (
                        <>
                            <Wallet size={variant === 'navbar' ? 16 : 24} className="group-hover:-rotate-12 transition-transform duration-300" />
                            <span>Connect Wallet</span>
                            {variant !== 'navbar' && <ChevronRight size={18} className="text-slate-400 group-hover:translate-x-1" />}
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default WalletConnect;
