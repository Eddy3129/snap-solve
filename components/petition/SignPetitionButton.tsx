'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';

interface Props {
  petitionId: string;
}

export default function SignPetitionButton({ petitionId }: Props) {
  const [isSigning, setIsSigning] = useState(false);
  const { publicKey, sendTransaction } = useWallet();

  const handleSignPetition = async () => {
    if (!publicKey) {
      alert('Please connect your wallet.');
      return;
    }

    setIsSigning(true);
    try {
      const connection = new Connection('https://api.devnet.solana.com');

      // Create instruction to interact with your program
      const programId = new PublicKey('YourProgramPublicKey'); // Replace with your program's public key
      const petitionPublicKey = new PublicKey(petitionId); // Petition account public key

      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: false },
          { pubkey: petitionPublicKey, isSigner: false, isWritable: true },
        ],
        programId,
        data: Buffer.from([]), // Include any necessary data for your instruction
      });

      const transaction = new Transaction().add(instruction);
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'processed');

      console.log('Petition signed successfully.');
    } catch (error) {
      console.error('Error signing petition:', error);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <button
      onClick={handleSignPetition}
      disabled={isSigning}
      className="w-full bg-pink-500 text-white font-bold py-2 px-4 rounded-full hover:bg-pink-600 transition duration-200"
    >
      {isSigning ? 'Signing...' : 'Sign Petition'}
    </button>
  );
}
