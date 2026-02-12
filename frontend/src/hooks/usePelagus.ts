import { useState, useEffect } from "react";

// Extend with our custom window type
declare global {
  interface Window {
    ethereum?: any;
    pelagus?: any;
    quai?: any;
  }
}

interface UsePelagusReturn {
  account: string | null;
  connect: () => Promise<string | null>;
  isInstalled: boolean;
  error: string | null;
}

export function usePelagus(): UsePelagusReturn {
  const [account, setAccount] = useState<string | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProvider = () => {
    if (typeof window !== "undefined") {
      if (window.pelagus) return window.pelagus;
      if (window.ethereum?.isPelagus) return window.ethereum;
    }
    return null;
  };

  useEffect(() => {
    const provider = getProvider();
    
    if (provider) {
      setIsInstalled(true);
      
      const checkAccounts = async () => {
          try {
              // Try quai_accounts first
              const accounts = await provider.request({ method: 'quai_accounts' });
              if (accounts && accounts.length > 0) {
                  setAccount(accounts[0]);
                  return;
              }
          } catch (e) {
              console.warn("quai_accounts failed, trying eth_accounts", e);
          }

          try {
              // Fallback to eth_accounts
              const accounts = await provider.request({ method: 'eth_accounts' });
              if (accounts && accounts.length > 0) {
                  setAccount(accounts[0]);
              }
          } catch (e) {
              console.error("Error checking accounts:", e);
          }
      };

      checkAccounts();

      // Listen for account changes
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
        } else {
            setAccount(null);
        }
      };

      provider.on("accountsChanged", handleAccountsChanged);

      return () => {
        if (provider.removeListener) {
            provider.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    } else {
        // Fallback to check if user has *any* wallet, but we specifically want Pelagus
        // If window.ethereum exists but isn't Pelagus, we might want to show "Installed" but maybe not capable?
        // But for simplicity, if getProvider() is null, we assume Pelagus isn't available.
        setIsInstalled(false);
    }
  }, []);

  const connect = async (): Promise<string | null> => {
    setError(null);
    const provider = getProvider();

    if (!provider) {
        setError("Pelagus Wallet not installed");
        window.open("https://pelaguswallet.io/", "_blank");
        return null;
    }

    try {
      // Use the specific quai method as requested
      const accounts = await provider.request({
        method: "quai_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        return accounts[0];
      }
    } catch (err: any) {
      console.error("Pelagus connection error:", err);
      setError(err.message || "Connection failed");
    }
    return null;
  };

  return { account, connect, isInstalled, error };
}
