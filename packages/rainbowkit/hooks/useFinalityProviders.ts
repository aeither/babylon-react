import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';

interface Description {
  moniker: string;
  identity: string;
  website: string;
  security_contact: string;
  details: string;
}

interface FinalityProvider {
  description: Description;
  commission: string;
  btc_pk: string;
  active_tvl: number;
  total_tvl: number;
  active_delegations: number;
  total_delegations: number;
}

export interface FinalityProvidersResponse {
  data: FinalityProvider[];
}

// Zustand store for selected finality provider
interface FinalityProviderStore {
  selectedFinalityProvider: FinalityProvider | null;
  selectFinalityProvider: (provider: FinalityProvider | null) => void;
}

export const useFinalityProviderStore = create<FinalityProviderStore>(
  (set) => ({
    selectedFinalityProvider: null,
    selectFinalityProvider: (provider) =>
      set({ selectedFinalityProvider: provider }),
  }),
);

const FINALITY_PROVIDERS_URL =
  'https://staking-api.testnet.babylonchain.io/v1/finality-providers';

export const useFinalityProviders = () => {
  return useQuery<FinalityProvidersResponse>({
    queryKey: ['finalityProviders'],
    queryFn: async () => {
      const options = {
        method: 'GET',
        headers: {
          'User-Agent': 'insomnia/10.1.1',
        },
      };

      const response = await fetch(FINALITY_PROVIDERS_URL, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json() as unknown as FinalityProvidersResponse;
    },
  });
};

// Helper hook to combine data fetching and selection
export const useFinalityProvidersWithSelection = () => {
  const { selectedFinalityProvider, selectFinalityProvider } =
    useFinalityProviderStore();
  const finalityProvidersQuery = useFinalityProviders();

  return {
    ...finalityProvidersQuery,
    selectedFinalityProvider,
    selectFinalityProvider,
  };
};