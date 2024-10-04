'use client'; // Mark this as a client component

import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import './Wallet.css';

// Dynamically import WalletMultiButton from Solana Wallet Adapter
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false } // Prevents server-side rendering for this component
);

export default function WalletClient() {
  const wallet = useWallet();

  return (
    <div className={`flex items-center gap-4 `}>
      <WalletMultiButtonDynamic className="wallet-button">
        {wallet.publicKey
          ? `${wallet.publicKey.toBase58().substring(0, 7)}...`
          : 'Connect Wallet'}
      </WalletMultiButtonDynamic>
    </div>
  );
}
