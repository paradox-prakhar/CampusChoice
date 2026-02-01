import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from './ui/Button';
import { Wallet, LogOut, Bell, Plus, LayoutDashboard } from 'lucide-react';
import { formatAddress } from '../lib/utils';

import { useState } from 'react';
import { ConnectPurposeModal } from './ConnectPurposeModal';

export function Navbar() {
  const { user, connectWallet, disconnectWallet, notifications, isLoading } = useApp();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <ConnectPurposeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleConnectPurpose} 
      />
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {/* CampusChoice Logo */}
          <img 
            src="/campuschoice-logo.png" 
            alt="CampusChoice" 
            className="w-16 h-16 object-contain"
          />
          <span className="font-bold text-xl tracking-tight text-slate-100">
            Campus<span className="text-cyan-400">Choice</span>
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-2">
                <Link to="/dashboard">
                  <Button variant={location.pathname === '/dashboard' ? 'default' : 'ghost'} size="sm">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                {user.role === 'PROPOSER' && (
                    <Link to="/create">
                        <Button variant={location.pathname === '/create' ? 'default' : 'ghost'} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            New Proposal
                        </Button>
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-4 border-l border-slate-800 pl-6">
               <div className="relative cursor-pointer">
                  <Bell className="w-5 h-5 text-slate-400 hover:text-indigo-400 transition-colors" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse ring-2 ring-slate-900"></span>
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
          <Button onClick={() => setIsModalOpen(true)} isLoading={isLoading}>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        )}
      </div>
    </nav>
  );
}
