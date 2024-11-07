'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
// import { ThemeProvider } from 'next-themes';
// import { GlobalParamsProvider } from './context/api/GlobalParamsProvider';
// import { StakingStatsProvider } from './context/api/StakingStatsProvider';
// import { BtcHeightProvider } from './context/mempool/BtcHeightProvider';
import { ErrorProvider } from '../components/ErrorContext';

export function BabylonProviders({ children }: React.PropsWithChildren) {
  const [client] = React.useState(new QueryClient());

  return (
    // <ThemeProvider defaultTheme="dark" attribute="data-theme">
    <QueryClientProvider client={client}>
      <ErrorProvider>
        {/* <GlobalParamsProvider>
            <BtcHeightProvider>
              <StakingStatsProvider>
                <ReactQueryStreamedHydration> */}
        {children}
        {/* </ReactQueryStreamedHydration>
              </StakingStatsProvider>
            </BtcHeightProvider>
          </GlobalParamsProvider> */}
      </ErrorProvider>
    </QueryClientProvider>
  );
}
