// src/app/page.tsx

import {
  BabylonConnectButton,
  BabylonProviders,
  useFinalityProviders,
} from 'babylon-react';
import type {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from 'react';

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
          <div key={provider.btc_pk} className='border rounded-md m-2 p-2'>
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
  return (
    <BabylonProviders>
      <main className="flex flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Babylon React SDK
        </h1>
        <p className="text-gray-600">Build Type Safe, Extensible, and Modular Babylon frontends</p>
        <button className="border px-4 py-2">
          <BabylonConnectButton>Connect Wallet</BabylonConnectButton>
        </button>
        <FinalityProvidersComponent />
      </main>
    </BabylonProviders>
  );
}
