// src/app/page.tsx

import { BabylonConnectButton, BabylonProviders } from 'babylon-react';

export default function HomePage() {
  return (
    <BabylonProviders>
      <main className="flex flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
        <p className="text-gray-600">Get started by editing this page</p>
        <button className="border px-4 py-2">
          <BabylonConnectButton>Connect Wallet</BabylonConnectButton>
        </button>
      </main>
    </BabylonProviders>
  );
}
