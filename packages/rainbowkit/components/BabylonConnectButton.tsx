import { useState } from 'react';
import { useWalletBalance } from '../hooks/useWalletBalance';
import { useWalletConnection } from '../hooks/useWalletConnection';
import { Balance } from './Balance';
import { ConnectModal } from './ConnectModal';

// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';
// import { useTermsAcceptance } from '../hooks/useAcceptTerms.js';

interface ConnectButtonProps {
  children: React.ReactNode;
}
export const BabylonConnectButton: React.FC<ConnectButtonProps> = ({
  children,
}) => {
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const {
    address,
    btcWallet,
    btcWalletNetwork,
    publicKeyNoCoord,
    handleConnectBTC,
    handleDisconnectBTC,
    handleBabylonStake,
  } = useWalletConnection();

  const { btcWalletBalanceSat, isLoading } = useWalletBalance(
    btcWallet,
    address,
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
          <Balance balanceSat={btcWalletBalanceSat} loading={isLoading} />
        </div>
      )}

      {address === '' ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setConnectModalOpen(true)}
        >
          {children}
        </button>
      ) : (
        <button onClick={handleDisconnectBTC}>Disconnect</button>
      )}

      {/* Staking Button */}
      {btcWallet && address && (
        <button
          onClick={handleBabylonStake}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Stake on Babylon
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
