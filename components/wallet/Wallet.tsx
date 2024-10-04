'use client';

import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { FC, useMemo } from 'react';


import '@solana/wallet-adapter-react-ui/styles.css';

type Props = {
  children?: React.ReactNode;
};

export const Wallet: FC<Props> = ({ children }) => {
  const endpoint = 'https://api.devnet.solana.com';

  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
