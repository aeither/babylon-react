import { BitgetWallet, bitgetWalletProvider } from './bitget.js';
// import bitgetWalletIcon from './icons/bitget.svg'
import { Network } from './wallet_provider.js';

interface IntegratedWallet {
  name: string;
  icon: string;
  wallet: any;
  linkToDocs: string;
  provider?: string;
  isQRWallet?: boolean;
  supportedNetworks?: Network[];
}

export const BROWSER_INJECTED_WALLET_NAME = 'Browser';

export const walletList: IntegratedWallet[] = [
  {
    name: 'Bitget Wallet',
    icon: 'bitgetWalletIcon', // commented out
    wallet: BitgetWallet,
    provider: bitgetWalletProvider,
    linkToDocs: 'https://web3.bitget.com',
    supportedNetworks: [Network.MAINNET, Network.SIGNET],
  },
];
