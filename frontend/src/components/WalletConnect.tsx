import { usePelagus } from '../hooks/usePelagus';
import { Button } from './ui/Button';
import { Wallet } from 'lucide-react';
import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const WalletConnect = () => {
  const { account, connect, isInstalled, error } = usePelagus();
  const { connectWallet, user } = useApp();

  // Sync with global AppState when account connects via hook
  useEffect(() => {
    if (account && (!user || user.wallet.toLowerCase() !== account.toLowerCase())) {
        // We pass the account to AppContext to update the global user state
        connectWallet(undefined, account); 
    }
  }, [account, user, connectWallet]);

  if (!isInstalled) {
     return (
        <a href="https://pelaguswallet.io/" target="_blank" rel="noreferrer">
             <Button variant="outline" className="gap-2">
                <Wallet className="w-4 h-4" />
                Install Pelagus
            </Button>
        </a>
     );
  }

  return (
    <div>
      {error && <span className="text-xs text-red-400 absolute -bottom-5 right-0">{error}</span>}
      <Button onClick={connect} variant="default" className="gap-2 bg-cyan-600 hover:bg-cyan-500">
        <Wallet className="w-4 h-4" />
        {account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Connect Pelagus"}
      </Button>
    </div>
  );
};
