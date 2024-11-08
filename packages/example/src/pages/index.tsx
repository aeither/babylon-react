// src/app/page.tsx

import {
  // BabylonConnectButton,
  BabylonProviders,
  useFinalityProviders,
  useWalletConnection,
  walletList,
} from 'babylon-react';
import type {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from 'react';
import { BabylonConnectButton } from '../components/BabylonConnectButton';

const FinalityProvidersComponent = () => {
  const { data, isLoading, error } = useFinalityProviders();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data.map(
        (provider: {
          btc_pk: Key | null | undefined;
          description: {
            moniker:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<AwaitedReactNode>
              | null
              | undefined;
          };
          commission:
            | string
            | number
            | bigint
            | boolean
            | ReactElement<any, string | JSXElementConstructor<any>>
            | Iterable<ReactNode>
            | ReactPortal
            | Promise<AwaitedReactNode>
            | null
            | undefined;
          active_tvl:
            | string
            | number
            | bigint
            | boolean
            | ReactElement<any, string | JSXElementConstructor<any>>
            | Iterable<ReactNode>
            | ReactPortal
            | Promise<AwaitedReactNode>
            | null
            | undefined;
        }) => (
          <div key={provider.btc_pk} className="border rounded-md m-2 p-2">
            <h3>{provider.description.moniker}</h3>
            <p>Commission: {provider.commission}</p>
            <p>Active TVL: {provider.active_tvl}</p>
            <p>BTC PK: {provider.btc_pk}</p>
          </div>
        ),
      )}
    </div>
  );
};

export default function HomePage() {
  const {
    address,
    btcWallet,
    btcWalletNetwork,
    handleBabylonStake,
    handleConnectBTC,
    handleDisconnectBTC,
    publicKeyNoCoord,
  } = useWalletConnection();

  return (
    <BabylonProviders>
      <main className="flex flex-col items-center justify-center p-24 space-y-6">
        <h1 className="text-4xl font-bold">Welcome to Babylon React SDK</h1>
        <p className="text-gray-600">
          Build Type Safe, Extensible, and Modular Babylon frontends
        </p>

        {/* Wallet Connection Status */}
        <div className="flex flex-col items-center space-y-4 w-full max-w-md">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg w-full">
            <h2 className="text-lg font-semibold mb-2">Wallet Status</h2>
            {address && (
              <p className="text-sm text-gray-600">
                ETH Address: {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            )}
            {btcWallet && (
              <div className="text-sm text-gray-600">
                <p>BTC Wallet: Connected</p>
                <p>Network: {btcWalletNetwork}</p>
                {publicKeyNoCoord && (
                  <p>
                    Public Key:{' '}
                    {typeof publicKeyNoCoord === 'string'
                      ? `${publicKeyNoCoord.slice(0, 10)}...`
                      : 'Invalid format'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Connection Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <BabylonConnectButton>Connect Wallet</BabylonConnectButton>
            </button>

            {!btcWallet ? (
              <button
                onClick={async () => {
                  try {
                    const defaultWallet = walletList[0];
                    if (!defaultWallet?.wallet) {
                      throw new Error('No wallet provider available');
                    }

                    // Initialize wallet with proper type checking
                    const walletInstance = new defaultWallet.wallet();

                    // Ensure we're only passing the necessary wallet interface
                    // rather than the entire wallet object
                    await handleConnectBTC(walletInstance);
                  } catch (error) {
                    console.error('BTC Wallet connection error:', error);
                  }
                }}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                Connect BTC Wallet
              </button>
            ) : (
              <button
                onClick={handleDisconnectBTC}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-red-500 flex items-center gap-2"
              >
                Disconnect BTC Wallet
              </button>
            )}
          </div>

          {/* Staking Button */}
          {btcWallet && address && (
            <button
              onClick={handleBabylonStake}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Stake on Babylon
            </button>
          )}
        </div>

        <FinalityProvidersComponent />
      </main>
    </BabylonProviders>
  );
}
