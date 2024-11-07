import { Network } from './wallet_provider.js';

export const network =
  (process.env.NEXT_PUBLIC_NETWORK as Network) || Network.SIGNET;

interface NetworkConfig {
  coinName: string;
  coinSymbol: string;
  networkName: string;
  mempoolApiUrl: string;
  network: Network;
}

const mainnetConfig: NetworkConfig = {
  coinName: 'BTC',
  coinSymbol: 'BTC',
  networkName: 'BTC',
  mempoolApiUrl: `${process.env.NEXT_PUBLIC_MEMPOOL_API}`,
  network: Network.MAINNET,
};

const signetConfig: NetworkConfig = {
  coinName: 'Signet BTC',
  coinSymbol: 'sBTC',
  networkName: 'BTC signet',
  mempoolApiUrl: `${process.env.NEXT_PUBLIC_MEMPOOL_API}/signet`,
  network: Network.SIGNET,
};

const testnetConfig: NetworkConfig = {
  coinName: 'Testnet BTC',
  coinSymbol: 'tBTC',
  networkName: 'BTC testnet',
  mempoolApiUrl: `${process.env.NEXT_PUBLIC_MEMPOOL_API}/testnet`,
  network: Network.TESTNET,
};

const config: Record<string, NetworkConfig> = {
  mainnet: mainnetConfig,
  signet: signetConfig,
  testnet: testnetConfig,
};

export function getNetworkConfig(): NetworkConfig {
  switch (network) {
    case Network.MAINNET:
      return config.mainnet || mainnetConfig;
    case Network.SIGNET:
      return config.signet || signetConfig;
    case Network.TESTNET:
      return config.testnet || testnetConfig;
    default:
      return config.signet || signetConfig;
  }
}

export function validateAddress(network: Network, address: string): void {
  if (network === Network.MAINNET && !address.startsWith('bc1')) {
    throw new Error(
      "Incorrect address prefix for Mainnet. Expected address to start with 'bc1'.",
    );
  }
  if (
    [Network.SIGNET, Network.TESTNET].includes(network) &&
    !address.startsWith('tb1')
  ) {
    throw new Error(
      "Incorrect address prefix for Testnet / Signet. Expected address to start with 'tb1'.",
    );
  }
  if (![Network.MAINNET, Network.SIGNET, Network.TESTNET].includes(network)) {
    throw new Error(
      `Unsupported network: ${network}. Please provide a valid network.`,
    );
  }
}
