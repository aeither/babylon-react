import { useCallback, useEffect, useState } from 'react';
import type { FinalityProvider as FinalityProviderInterface } from '../types/finalityProviders';

export const useFinalityProvidersData = (
  initialProviders: FinalityProviderInterface[] | undefined,
  publicKeyNoCoord?: string,
  showError?: (params: {
    error: { message: string; errorState: string };
    retryAction: () => void;
  }) => void,
) => {
  const [filteredProviders, setFilteredProviders] = useState(initialProviders);
  const [finalityProvider, setFinalityProvider] = useState<
    FinalityProviderInterface | undefined
  >();

  useEffect(() => {
    setFilteredProviders(initialProviders);
  }, [initialProviders]);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      const filtered = initialProviders?.filter(
        (fp) =>
          fp.description?.moniker
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          fp.btcPk.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredProviders(filtered);
    },
    [initialProviders],
  );

  const selectFinalityProvider = useCallback(
    (btcPkHex: string) => {
      let found: FinalityProviderInterface | undefined;
      try {
        if (!initialProviders) {
          throw new Error('Finality providers not loaded');
        }

        found = initialProviders.find((fp) => fp?.btcPk === btcPkHex);
        if (!found) {
          throw new Error('Finality provider not found');
        }

        if (found.btcPk === publicKeyNoCoord) {
          throw new Error(
            'Cannot select a finality provider with the same public key as the wallet',
          );
        }
      } catch (error: any) {
        showError?.({
          error: {
            message: error.message,
            errorState: 'STAKING',
          },
          retryAction: () => selectFinalityProvider(btcPkHex),
        });
        return;
      }

      setFinalityProvider(found);
    },
    [initialProviders, publicKeyNoCoord, showError],
  );

  return {
    filteredProviders,
    setFilteredProviders,
    handleSearch,
    finalityProvider,
    selectFinalityProvider,
  };
};