import '@rainbow-me/rainbowkit/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from 'babylon-react';
import { WagmiProvider } from 'wagmi';

import App from './App';
import { config } from './wagmi';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
