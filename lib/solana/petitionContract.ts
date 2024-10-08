import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

const createPetition = async (title: string, target: number) => {
    const { publicKey, sendTransaction } = useWallet();
    const connection = new Connection('https://api.devnet.solana.com');

    // Create a new account for the petition
    const petitionAccount = new PublicKey('7FcfVtvxT1RTkaxFFztSKgRux8gxc6Jt9SDRtAAL4EYN'); // Generate a new public key for the petition account

    const instruction = new TransactionInstruction({
        keys: [{ pubkey: petitionAccount, isSigner: false, isWritable: true }],
        programId: new PublicKey('CE9o9PCViGnKuJe9rqBLFqtM4DFXzcSQKnfFmRRsFfmu'),
        // data: Buffer.from([...]), // Encode title and target
    });

    const transaction = new Transaction().add(instruction);
    const signature = await sendTransaction(transaction, connection);
    await connection.confirmTransaction(signature, 'processed');
};