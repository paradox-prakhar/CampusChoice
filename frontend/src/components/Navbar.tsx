import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';
import { LogOut, Bell, Plus, LayoutDashboard } from 'lucide-react';
import { formatAddress } from '../lib/utils';
// import { WalletConnectButton } from './WalletConnectButton';
import { WalletConnect } from './WalletConnect';

import { useState } from 'react';
import { ConnectPurposeModal } from './ConnectPurposeModal';

export function Navbar() {
  const { user, connectWallet, disconnectWallet, notifications, network, setNetwork } = useApp();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleConnectPurpose = async (purpose: 'VOTE' | 'PROPOSE') => {
    setIsModalOpen(false);
    await connectWallet(purpose === 'PROPOSE' ? 'PROPOSER' : undefined);
    
    setTimeout(() => {
        if (purpose === 'PROPOSE') {
            navigate('/create');
        } else {
            navigate('/dashboard');
        }
    }, 100);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="border-b border-white/10 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
      <ConnectPurposeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleConnectPurpose} 
      />
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          {/* CampusChoice Logo */}
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src="/campuschoice-logo.png" 
              alt="CampusChoice" 
              className="w-12 h-12 object-contain relative z-10 drop-shadow-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
              Campus<span className="text-cyan-400">Choice</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/80 font-medium">Decentralized Voting</span>
          </div>
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-2 animate-fade-in [animation-delay:200ms]">
                <Link to="/dashboard">
                  <Button variant={location.pathname === '/dashboard' ? 'default' : 'ghost'} size="sm" className="glow-on-hover transition-all duration-300">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                {user.role === 'PROPOSER' && (
                    <Link to="/create" className="animate-fade-in [animation-delay:300ms]">
                        <Button variant={location.pathname === '/create' ? 'default' : 'ghost'} size="sm" className="glow-on-hover transition-all duration-300">
                            <Plus className="w-4 h-4 mr-2" />
                            New Proposal
                        </Button>
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-4 border-l border-white/10 pl-6 animate-fade-in [animation-delay:400ms]">
               <div className="relative cursor-pointer group">
                  <Bell className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse ring-2 ring-slate-900"></span>
                  )}
               </div>

                <div className="relative">
                  <button 
                    onClick={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 glow-on-hover"
                  >
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                    <span className="text-xs font-medium text-slate-200">
                      {network === 'quai-cyprus1' ? 'Quai Cyprus-1' : network === 'quai-orchard' ? 'Quai Orchard' : 'Sepolia'}
                    </span>
                  </button>

                  {isNetworkDropdownOpen && (
                    <div className="absolute top-full mt-2 right-0 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <button 
                        onClick={() => { setNetwork('quai-cyprus1'); setIsNetworkDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                      >
                        Quai Network Cyprus-1
                      </button>
                      <button 
                        onClick={() => { setNetwork('quai-orchard'); setIsNetworkDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                      >
                        Quai Orchard Testnet
                      </button>
                      <button 
                        onClick={() => { setNetwork('sepolia'); setIsNetworkDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors"
                      >
                        Sepolia Testnet
                      </button>
                    </div>
                  )}
                </div>

               <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-xs text-slate-400 font-mono">{formatAddress(user.wallet)}</span>
                  <span className="text-[10px] text-green-400 bg-green-900/20 px-1.5 rounded border border-green-900/30 uppercase tracking-wider">
                    {user.role}
                  </span>
               </div>
               
               <Button variant="ghost" size="icon" onClick={disconnectWallet} title="Disconnect">
                  <LogOut className="w-4 h-4 text-slate-400" />
               </Button>
            </div>
          </div>
        ) : (
          <WalletConnect />
        )}
      </div>
    </nav>
  );
}
