import { useWalletConnection } from 'babylon-react';
import { useState } from 'react';
import { ConnectModal } from './ConnectModal';
// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';

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