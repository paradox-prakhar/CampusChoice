import { usePelagus } from '../hooks/usePelagus';
import { Button } from './ui/Button';
import { Wallet, X, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';

export const WalletConnect = () => {
  const { account, connect, isInstalled, error: pelagusError } = usePelagus();
  const { connectWallet, user } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync with global AppState when account connects via hook
  useEffect(() => {
    const savedWallet = localStorage.getItem('connected_wallet');
    // Only auto-connect if there is a saved session OR if the user is already connected (switching accounts)
    if (account && (savedWallet || user)) {
        if (!user || user.wallet.toLowerCase() !== account.toLowerCase()) {
            // We pass the account to AppContext to update the global user state
            connectWallet(undefined, account); 
        }
    }
  }, [account, user, connectWallet]);

  const handlePelagusConnect = async () => {
    setIsModalOpen(false);
    if (!isInstalled) {
        window.open("https://pelaguswallet.io/", "_blank");
        return;
    }
    const addr = await connect();
    if (addr) connectWallet(undefined, addr);
  };

  const handleMetaMaskConnect = async () => {
    setIsModalOpen(false);
    await connectWallet();
  };

  const resetState = () => {
      setIsModalOpen(false);
  };

  return (
    <>
      <div>
        {pelagusError && <span className="text-xs text-red-400 absolute -bottom-5 right-0">{pelagusError}</span>}
        <Button onClick={() => setIsModalOpen(true)} variant="default" className="gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300">
          <Wallet className="w-4 h-4" />
          <span className="font-semibold tracking-wide">Connect Wallet</span>
        </Button>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-fade-in" onClick={resetState} />
          <div className="relative glass-panel rounded-2xl p-1 max-w-sm w-full shadow-2xl shadow-cyan-500/10 transform transition-all animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Gradient Border content */}
            <div className="bg-slate-900/90 rounded-xl p-6 relative z-10">
                <button 
                onClick={resetState}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                >
                <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8 pt-2">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-float">
                        <Wallet className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 tracking-tight animate-fade-in [animation-delay:100ms]">Connect Wallet</h2>
                    <p className="text-sm text-slate-400 animate-fade-in [animation-delay:200ms]">Choose your preferred wallet to access CampusChoice</p>
                </div>

                <div className="grid grid-cols-1 gap-3 animate-fade-in [animation-delay:300ms]">
                    <button 
                        onClick={handlePelagusConnect}
                        className="group relative flex items-center p-4 bg-slate-800/50 hover:bg-cyan-950/30 border border-slate-700/50 hover:border-cyan-500/50 rounded-xl transition-all overflow-hidden glow-on-hover"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110 transition-all border border-slate-700 group-hover:border-cyan-500/30 relative z-10 shadow-lg">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div className="ml-4 text-left relative z-10">
                            <h3 className="text-md font-semibold text-white group-hover:text-cyan-100 transition-colors">Pelagus Wallet</h3>
                            <p className="text-xs text-slate-500 group-hover:text-cyan-400/70 transition-colors">Recommended for Quai</p>
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                        </div>
                    </button>

                    <button 
                        onClick={handleMetaMaskConnect}
                        className="group relative flex items-center p-4 bg-slate-800/50 hover:bg-orange-950/30 border border-slate-700/50 hover:border-orange-500/50 rounded-xl transition-all overflow-hidden glow-on-hover"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-orange-400 group-hover:text-orange-300 group-hover:scale-110 transition-all border border-slate-700 group-hover:border-orange-500/30 relative z-10 shadow-lg">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div className="ml-4 text-left relative z-10">
                            <h3 className="text-md font-semibold text-white group-hover:text-orange-100 transition-colors">MetaMask / Other</h3>
                            <p className="text-xs text-slate-500 group-hover:text-orange-400/70 transition-colors">Standard EVM Wallets</p>
                        </div>
                    </button>
                </div>
            </div>
            
            {/* Background Gradient Blur */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
