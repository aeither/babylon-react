import { getNetworkConfig, walletList } from 'babylon-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { PiWalletBold } from 'react-icons/pi';
import { twJoin } from 'tailwind-merge';
import type { WalletProvider } from '../types/WalletProvider';
import { GeneralModal } from './GeneralModal';

interface ConnectModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  onConnect: (walletProvider: WalletProvider) => void;
  connectDisabled: boolean;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  open,
  onClose,
  onConnect,
  connectDisabled,
}) => {
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const BROWSER = 'btcwallet';

  useEffect(() => {
    const fetchWalletProviderDetails = async () => {
      if ((window as any)[BROWSER]) {
      }
    };
    setMounted(true);
    fetchWalletProviderDetails();
  }, []);

  if (!mounted) return null;

  const isInjectable = !!(window as any)[BROWSER];
  const { networkName } = getNetworkConfig();
  const defaultWallet = walletList[0];

  const handleConnect = async () => {
    if (!selectedWallet) return;

    try {
      let walletInstance: WalletProvider;
      if (selectedWallet === BROWSER) {
        if (!isInjectable) {
          throw new Error('Browser selected without an injectable interface');
        }
        walletInstance = (window as any)[BROWSER];
      } else {
        const walletProvider = walletList[0]?.wallet;
        if (!walletProvider) {
          throw new Error('Wallet provider not found');
        }
        walletInstance = new walletProvider() as any;
      }
      setSelectedWallet('');
      onConnect(walletInstance);
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <GeneralModal
      className="p-6 bg-white"
      open={open}
      onClose={onClose}
      closeOnOverlayClick={true}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Connect wallet</h3>
          <button
            className="btn btn-circle btn-ghost btn-sm"
            onClick={() => onClose(false)}
            aria-label="Close modal"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-center font-semibold">Choose wallet</h3>
          {defaultWallet && (
            <div className="max-h-[60vh] overflow-y-auto">
              <button
                className={twJoin(
                  'w-full flex items-center gap-3 p-4 rounded-xl border-2 bg-base-100 transition-all hover:text-primary',
                  selectedWallet === defaultWallet.name
                    ? 'border-primary'
                    : 'border-base-100',
                )}
                onClick={() => setSelectedWallet(defaultWallet.name)}
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-full border bg-white">
                  <FaWallet size={26} />
                </div>
                <span className="flex-1 text-left">{defaultWallet.name}</span>
              </button>
            </div>
          )}
        </div>

        <button
          className="btn btn-primary w-full gap-2 mt-4"
          onClick={handleConnect}
          disabled={connectDisabled || !selectedWallet}
        >
          <PiWalletBold size={20} />
          <span>Connect to {networkName} network</span>
        </button>
      </div>
    </GeneralModal>
  );
};