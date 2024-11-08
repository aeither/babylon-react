import { useQuery } from '@tanstack/react-query';
// import { useError } from '../components/ErrorContext.js';
import { getNetworkConfig } from '../providers/network.config.js';
import type { WalletProvider } from '../providers/wallet_provider.js';
import { UTXO_KEY } from '../utils/constants';

const { mempoolApiUrl } = getNetworkConfig();

const mempoolAPI = `${mempoolApiUrl}/api/`;

// URL for the address info endpoint
function addressInfoUrl(address: string): URL {
  return new URL(`${mempoolAPI}address/${address}`);
}


 async function getAddressBalance(address: string): Promise<number> {
  const response = await fetch(addressInfoUrl(address));
  if (!response.ok) {
    const err = await response.text();
    throw new Error(err);
  }
    const addressInfo = await response.json();
    return (
      addressInfo.chain_stats.funded_txo_sum -
      addressInfo.chain_stats.spent_txo_sum
    );
}

export const useWalletBalance = (
  btcWallet: WalletProvider | undefined,
  address: string,
) => {
  // const { isErrorOpen } = useError();

  const { data: balance, isLoading } = useQuery({
    queryKey: [UTXO_KEY, address],
    queryFn: async () => {
      if (!address) {
        throw new Error('Address not available');
      }
      try {
        // Try wallet provider first
        if (btcWallet?.getBalance) {
          return await btcWallet.getBalance();
        }
        // Fallback to mempool API
        return await getAddressBalance(address);
      } catch (error) {
        console.error('Error fetching balance:', error);
        throw error;
      }
    },
    enabled: !!address,
    refetchInterval: 60000 * 5,
    retry: (failureCount) => failureCount <= 3,
    initialData: 0,
  });

  return {
    btcWalletBalanceSat: balance,
    isLoading,
  };
};