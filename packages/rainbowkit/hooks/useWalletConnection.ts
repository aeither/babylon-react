import { useQuery } from '@tanstack/react-query';
import type { networks } from 'bitcoinjs-lib';
import { useCallback, useMemo, useState } from 'react';
// import { useError } from '../components/ErrorContext.jsx';
import { useBtcHeight } from '../providers/BtcHeightProvider.js';
import { useGlobalParams } from '../providers/GlobalParamsProvider.js';
import type { WalletProvider } from '../providers/wallet_provider.js';
import { WalletError, WalletErrorType } from '../types/errors.js';
import { UTXO_KEY } from '../utils/constants.js';
import type { GlobalParamsVersion } from '../utils/getStakingTerm.js';
import { getCurrentGlobalParamsVersion } from '../utils/globalParams.js';
import {
  getPublicKeyNoCoord,
  isSupportedAddressType,
  toNetwork,
} from '../utils/index.js';
import { signStakingTx } from '../utils/staking.js';

export interface ParamsWithContext {
  currentVersion: GlobalParamsVersion | undefined;
  nextVersion: GlobalParamsVersion | undefined;
  isApprochingNextVersion: boolean;
  firstActivationHeight: number;
}

export const useWalletConnection = () => {
  const [address, setAddress] = useState('');
  const [btcWallet, setBTCWallet] = useState<WalletProvider>();
  const [btcWalletNetwork, setBTCWalletNetwork] = useState<networks.Network>();
  const [publicKeyNoCoord, setPublicKeyNoCoord] = useState('');
  // const { showError } = useError();
  const [paramWithCtx, setParamWithCtx] = useState<
    ParamsWithContext | undefined
  >();
  const btcHeight = useBtcHeight();
  const globalParams = useGlobalParams();

  const shouldFilterOrdinals = false;
  // Fetch all UTXOs
  const {
    data: availableUTXOs,
    error: availableUTXOsError,
    isError: hasAvailableUTXOsError,
    refetch: refetchAvailableUTXOs,
  } = useQuery({
    queryKey: [UTXO_KEY, address, shouldFilterOrdinals],
    queryFn: async () => {
      if (btcWallet?.getUtxos && address) {
        // all confirmed UTXOs from the wallet
        const mempoolUTXOs = await btcWallet.getUtxos(address);

        // return the UTXOs if we don't need to filter out the ordinals
        if (!shouldFilterOrdinals) return mempoolUTXOs;

        // filter out the ordinals
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
      return failureCount <= 3;
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useMemo(() => {
    if (!btcHeight || !globalParams.data) {
      return;
    }
    const paramCtx = getCurrentGlobalParamsVersion(
      btcHeight + 1,
      globalParams.data,
    );
    setParamWithCtx(paramCtx);
  }, [btcHeight, globalParams]);

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

        // showError({
        //   error: {
        //     message: errorMessage,
        //     errorState: ErrorState.WALLET,
        //   },
        //   retryAction: () => handleConnectBTC(walletProvider),
        // });
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

  const handleBabylonStake = async () => {
    try {
      if (!btcWallet) throw new Error('Wallet is not connected');
      if (!address) throw new Error('Address is not set');
      if (!btcWalletNetwork) throw new Error('Wallet network is not connected');
      // if (!finalityProvider)
      //   throw new Error('Finality provider is not selected');
      // if (!paramWithCtx || !paramWithCtx.currentVersion)
      //   throw new Error('Global params not loaded');
      // if (!feeRate) throw new Error('Fee rates not loaded');
      // if (!availableUTXOs || availableUTXOs.length === 0)
      //   throw new Error('No available balance');

      // const { currentVersion: globalParamsVersion } = paramWithCtx;
      // Sign the staking transaction
      const { stakingTxHex, stakingTerm } = await signStakingTx(
        btcWallet,
        {
          version: 4,
          activationHeight: 220637,
          stakingCapSat: 0,
          stakingCapHeight: 223661,
          tag: '62627434',
          covenantPks: [
            '03fa9d882d45f4060bdb8042183828cd87544f1ea997380e586cab77d5fd698737',
            '020aee0509b16db71c999238a4827db945526859b13c95487ab46725357c9a9f25',
            '0217921cf156ccb4e73d428f996ed11b245313e37e27c978ac4d2cc21eca4672e4',
            '02113c3a32a9d320b72190a04a020a0db3976ef36972673258e9a38a364f3dc3b0',
            '0379a71ffd71c503ef2e2f91bccfc8fcda7946f4653cef0d9f3dde20795ef3b9f0',
            '023bb93dfc8b61887d771f3630e9a63e97cbafcfcc78556a474df83a31a0ef899c',
            '03d21faf78c6751a0d38e6bd8028b907ff07e9a869a43fc837d6b3f8dff6119a36',
            '0340afaf47c4ffa56de86410d8e47baa2bb6f04b604f4ea24323737ddc3fe092df',
            '03f5199efae3f28bb82476163a7e458c7ad445d9bffb0682d10d3bdb2cb41f8e8e',
          ],
          covenantQuorum: 6,
          unbondingTime: 1008,
          unbondingFeeSat: 5000,
          maxStakingAmountSat: 50000000,
          minStakingAmountSat: 50000,
          maxStakingTimeBlocks: 64000,
          minStakingTimeBlocks: 64000,
          confirmationDepth: 10,
        }, // globalParamsVersion,
        50000, //stakingAmountSat,
        0, //stakingTimeBlocks,
        'f4940b238dcd00535fde9730345bab6ff4ea6d413cc3602c4033c10f251c7e81', //finalityProvider.btcPk,
        btcWalletNetwork,
        address,
        publicKeyNoCoord,
        1, //feeRate, 
        [
          {
            txid: 'd5584535c35623e68e30f9402448e4d6978ee15d60564a5c0776c27b7bf05e25',
            vout: 2,
            value: 4899466,
            scriptPubKey:
              '5120786d05e9c5618c67e6e112ebb9b051514bc582f7906221618e0a33c0a59d2267',
          },
        ], //availableUTXOs,
      );
      console.log('stakingTxHex, stakingTerm', stakingTxHex, stakingTerm);

      // Invalidate UTXOs
      // queryClient.invalidateQueries({ queryKey: [UTXO_KEY, address] });
      // UI
      // handleFeedbackModal('success');
      // handleLocalStorageDelegations(stakingTxHex, stakingTerm);
      // handleResetState();
    } catch (error: any) {
      console.log(error);
    } finally {
    }
  };

  return {
    address,
    btcWallet,
    btcWalletNetwork,
    publicKeyNoCoord,
    handleConnectBTC,
    handleDisconnectBTC,
    handleBabylonStake,
  };
};
