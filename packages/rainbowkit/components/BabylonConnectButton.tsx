import { useCallback, useState } from 'react';
import { ConnectModal } from './ConnectModal';

import { useQuery } from '@tanstack/react-query';
import type { networks } from 'bitcoinjs-lib';
// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';
// import { useTermsAcceptance } from '../hooks/useAcceptTerms.js';
import type { WalletProvider } from '../providers/wallet_provider.js';
import { ErrorState, WalletError, WalletErrorType } from '../types/errors.js';
import { UTXO_KEY } from '../utils/constants';
import {
  getPublicKeyNoCoord,
  isSupportedAddressType,
  toNetwork,
} from '../utils/index.js';
import { useError } from './ErrorContext.jsx';

interface ConnectButtonProps {
  children: React.ReactNode;
}

interface BalanceProps {
  balanceSat?: number;
  loading?: boolean;
}

// Add these utility functions if you don't have them:
const satoshiToBtc = (satoshis: number): number => {
  return satoshis / 100000000;
};

const maxDecimals = (value: number, decimals: number): number => {
  return Number(value.toFixed(decimals));
};

const Balance: React.FC<BalanceProps> = ({ balanceSat, loading }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (typeof balanceSat === 'undefined') {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <span className="font-semibold">
        {maxDecimals(satoshiToBtc(balanceSat), 8)}
      </span>
      <span>BTC</span>
    </div>
  );
};

export const BabylonConnectButton: React.FC<ConnectButtonProps> = ({
  children,
}) => {
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [btcWallet, setBTCWallet] = useState<WalletProvider>();
  const [btcWalletNetwork, setBTCWalletNetwork] = useState<networks.Network>();
  const [publicKeyNoCoord, setPublicKeyNoCoord] = useState('');
  const { showError } = useError();
  // const { logTermsAcceptance } = useTermsAcceptance();

  //   const [hasSeenFilterOrdinalsModal, setHasSeenFilterOrdinalsModal] =
  //     useLocalStorage<Record<string, boolean>>(FILTER_ORDINALS_MODAL_KEY, {});

  const {
    isErrorOpen,
    // error,
    // showError,
    // hideError,
    // retryErrorAction,
    // noCancel,
    // handleError,
  } = useError();

  // Fetch all UTXOs
  const {
    data: availableUTXOs,
    // error: availableUTXOsError,
    // isError: hasAvailableUTXOsError,
    // refetch: refetchAvailableUTXOs,
  } = useQuery({
    queryKey: [UTXO_KEY, address],
    queryFn: async () => {
      if (btcWallet?.getUtxos && address) {
        // all confirmed UTXOs from the wallet
        const mempoolUTXOs = await btcWallet.getUtxos(address);
        return mempoolUTXOs;
        // // return the UTXOs if we don't need to filter out the ordinals
        // if (!shouldFilterOrdinals) return mempoolUTXOs;

        // // filter out the ordinals
        // const filteredUTXOs = await filterOrdinals(
        //   mempoolUTXOs,
        //   address,
        //   btcWallet.getInscriptions,
        // );
        // return filteredUTXOs;
      }
    },
    enabled: !!(btcWallet?.getUtxos && address),
    refetchInterval: 60000 * 5, // 5 minutes
    retry: (failureCount) => {
      return !isErrorOpen && failureCount <= 3;
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleConnectBTC = useCallback(
    async (walletProvider: WalletProvider) => {
      // close the modal
      setConnectModalOpen(false);

      const supportedNetworkMessage =
        'Only Native SegWit and Taproot addresses are supported. Please switch the address type in your wallet and try again.';

      try {
        await walletProvider.connectWallet();
        const address = await walletProvider.getAddress();
        // check if the wallet address type is supported in babylon
        const supported = isSupportedAddressType(address);
        if (!supported) {
          throw new Error(supportedNetworkMessage);
        }

        const publicKeyNoCoord = getPublicKeyNoCoord(
          await walletProvider.getPublicKeyHex(),
        );
        setBTCWallet(walletProvider);
        setBTCWalletNetwork(toNetwork(await walletProvider.getNetwork()));
        setPublicKeyNoCoord(publicKeyNoCoord.toString('hex'));
        setAddress(address);

        // Show the modal only if it hasn't been seen before for the address
        // if (!hasSeenFilterOrdinalsModal[address]) {
        //   setFilterOrdinalsModalOpen(true);
        // }

        // Log the terms acceptance
        // logTermsAcceptance({
        //   address,
        //   public_key: publicKeyNoCoord.toString('hex'),
        // });
      } catch (error: any) {
        if (
          error instanceof WalletError &&
          error.getType() === WalletErrorType.ConnectionCancelled
        ) {
          // User cancelled the connection, hence do nothing
          return;
        }
        let errorMessage: string;
        switch (true) {
          case /Incorrect address prefix for (Testnet \/ Signet|Mainnet)/.test(
            error.message,
          ):
            errorMessage = supportedNetworkMessage;
            break;
          default:
            errorMessage = error.message;
            break;
        }
        showError({
          error: {
            message: errorMessage,
            errorState: ErrorState.WALLET,
          },
          retryAction: () => handleConnectBTC(walletProvider),
        });
      }
    },
    [],
  );

  const handleDisconnectBTC = useCallback(() => {
    setBTCWallet(undefined);
    setBTCWalletNetwork(undefined);
    setPublicKeyNoCoord('');
    setAddress('');
  }, []);

  const btcWalletBalanceSat = availableUTXOs?.reduce(
    (accumulator, item) => accumulator + item.value,
    0,
  );

  return (
    <>
      <ConnectModal
        open={connectModalOpen}
        onClose={setConnectModalOpen}
        onConnect={handleConnectBTC}
        connectDisabled={!!address}
      />
      {address && (
        <div className="flex flex-col gap-2">
          <div>Address: {address}</div>
          <Balance
            balanceSat={btcWalletBalanceSat}
            loading={availableUTXOs === undefined}
          />
        </div>
      )}

      {address === '' ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setConnectModalOpen(true);
          }}
        >
          {children}
        </button>
      ) : (
        <button
          onClick={() => {
            handleDisconnectBTC();
          }}
        >
          Disconnect
        </button>
      )}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          console.log(
            'btcWallet, btcWalletNetwork, publicKeyNoCoord',
            btcWallet,
            btcWalletNetwork,
            publicKeyNoCoord,
          );
        }}
      >
        Info
      </button>
    </>
  );
};
