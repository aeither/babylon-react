import { useQuery } from '@tanstack/react-query';

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