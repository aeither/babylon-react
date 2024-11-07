import type { networks } from 'bitcoinjs-lib';
import { useCallback, useState } from 'react';
import { useError } from '../components/ErrorContext.jsx';
import type { WalletProvider } from '../providers/wallet_provider.js';
import { ErrorState, WalletError, WalletErrorType } from '../types/errors.js';
import {
  getPublicKeyNoCoord,
  isSupportedAddressType,
  toNetwork,
} from '../utils/index.js';

export const useWalletConnection = () => {
  const [address, setAddress] = useState('');
  const [btcWallet, setBTCWallet] = useState<WalletProvider>();
  const [btcWalletNetwork, setBTCWalletNetwork] = useState<networks.Network>();
  const [publicKeyNoCoord, setPublicKeyNoCoord] = useState('');
  const { showError } = useError();

  const handleConnectBTC = useCallback(
    async (walletProvider: WalletProvider) => {
      const supportedNetworkMessage =
        'Only Native SegWit and Taproot addresses are supported. Please switch the address type in your wallet and try again.';

      try {
        await walletProvider.connectWallet();
        const address = await walletProvider.getAddress();

        if (!isSupportedAddressType(address)) {
          throw new Error(supportedNetworkMessage);
        }

        const publicKeyNoCoord = getPublicKeyNoCoord(
          await walletProvider.getPublicKeyHex(),
        );

        setBTCWallet(walletProvider);
        setBTCWalletNetwork(toNetwork(await walletProvider.getNetwork()));
        setPublicKeyNoCoord(publicKeyNoCoord.toString('hex'));
        setAddress(address);
      } catch (error: any) {
        if (
          error instanceof WalletError &&
          error.getType() === WalletErrorType.ConnectionCancelled
        ) {
          return;
        }

        const errorMessage =
          /Incorrect address prefix for (Testnet \/ Signet|Mainnet)/.test(
            error.message,
          )
            ? supportedNetworkMessage
            : error.message;

        showError({
          error: {
            message: errorMessage,
            errorState: ErrorState.WALLET,
          },
          retryAction: () => handleConnectBTC(walletProvider),
        });
      }
    },
    [showError],
  );

  const handleDisconnectBTC = useCallback(() => {
    setBTCWallet(undefined);
    setBTCWalletNetwork(undefined);
    setPublicKeyNoCoord('');
    setAddress('');
  }, []);

  return {
    address,
    btcWallet,
    btcWalletNetwork,
    publicKeyNoCoord,
    handleConnectBTC,
    handleDisconnectBTC,
  };
};