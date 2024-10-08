import React, { useState } from 'react';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { Button } from '../ui/button';
import { AnchorProvider, Program, Idl, setProvider } from '@coral-xyz/anchor';
import idl from '../../petition_program/target/idl/petition_program.json';
import { supabase } from '@/lib/supabase';  // Import Supabase for updating vote count
import * as borsh from '@coral-xyz/borsh';

// Define the Borsh schema for petition data
const PetitionSchema = borsh.struct([
  borsh.array(borsh.u8(), 8, "discriminator"),
  borsh.publicKey("creator"),
  borsh.u64("current_votes"),
  borsh.u64("target_votes"),
  borsh.u8("bump"),
]);

interface Petition {
  creator: PublicKey;
  current_votes: bigint; 
  target_votes: bigint;
  bump: number;
}

interface Props {
  petitionId: string;
  onSignSuccess: () => void;
}

const SignPetitionButton: React.FC<Props> = ({ petitionId, onSignSuccess }) => {
  const [isSigning, setIsSigning] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();
  const publicKey = anchorWallet?.publicKey;

  if (!anchorWallet || !publicKey) {
    return <Button disabled>Please connect your wallet</Button>;
  }

  const fetchPetitionData = async (petitionAccount: PublicKey): Promise<Petition | null> => {
    try {
      const accountInfo = await connection.getAccountInfo(petitionAccount);
  
      if (accountInfo && accountInfo.data) {
        const decodedData = PetitionSchema.decode(accountInfo.data);
        return {
          ...decodedData,
          current_votes: Number(decodedData.current_votes),
          target_votes: Number(decodedData.target_votes)   
        };
      } else {
        console.error('No data found for this petition');
        return null;
      }
    } catch (error) {
      console.error('Error fetching petition data:', error);
      return null;
    }
  };

  const handleSignPetition = async () => {
    setIsSigning(true);
  
    try {
      // Step 1: Check wallet balance
      const balance = await connection.getBalance(publicKey);
      if (balance < 0.01 * 1e9) { // 0.01 SOL in lamports
        throw new Error("Insufficient balance to sign the petition.");
      }
  
      // Step 2: Set up Anchor provider and program
      const provider = new AnchorProvider(connection, anchorWallet, {
        preflightCommitment: 'processed',
      });
      setProvider(provider);
      const programId = new PublicKey("xnvDsEDqnUh22BRpicSSSJHKjKtBJpPa1j1esc8tpww");
      const program = new Program(idl as Idl, provider);
  
      // Step 3: Create PublicKey for petition account
      const petitionAccount = new PublicKey(petitionId);
  
      // Fetch petition data using the deserialization method
      const petitionData = await fetchPetitionData(petitionAccount);
  
      if (petitionData) {
        // If petition data is present, log it
        console.log("Petition Creator (Pubkey):", petitionData.creator.toBase58());
        console.log("Current Votes:", petitionData.current_votes);
        console.log("Target Votes:", petitionData.target_votes);
        console.log("Bump (u8):", petitionData.bump);
      } else {
        console.error("Could not retrieve petition data.");
        alert("Could not retrieve petition data. Please try again or check the petition ID.");
        setIsSigning(false);
        return; // Exit the function early if no petition data is found
      }
  
      // Step 4: Derive the PDA for the vote account
      const [votePDA, _] = await PublicKey.findProgramAddressSync(
        [Buffer.from("vote"), petitionAccount.toBuffer(), publicKey.toBuffer()],
        program.programId
      );
  
      // Step 5: Create the transaction for the vote
      const tx = await program.methods
        .vote()
        .accounts({
          petition: petitionAccount,
          voteAccount: votePDA,
          voter: publicKey,
          creator: petitionData.creator, // Use the creator field from deserialized data
          systemProgram: SystemProgram.programId,
        })
        .rpc();
  
      console.log('Vote transaction signature:', tx);
  
      // Optionally, confirm the transaction
      await connection.confirmTransaction(tx, 'processed');
  
      const updatedPetitionData = await fetchPetitionData(petitionAccount);
  
      if (updatedPetitionData) {
        console.log("Updated Petition Data from Blockchain:", updatedPetitionData.current_votes);
      }
    
      const currentVotes= updatedPetitionData?.current_votes;
  
      // Increment vote count in Supabase
      const { error: updateError } = await supabase
        .from('petitions')
        .update({ votes: currentVotes }) 
        .eq('petition_id', petitionId);
  
      if (updateError) {
        console.error('Error updating vote count in Supabase:', updateError.message);
      } else {
        console.log('Vote count updated in Supabase successfully.');
      }
  
      alert(`Petition signed successfully! Transaction signature: ${tx}`);
      setHasSigned(true);
      onSignSuccess(); // Refetch petition data to update the UI
    } catch (error: any) {
      console.error('Error signing petition:', error);
      alert(`Error signing petition: ${error.message}`);
    } finally {
      setIsSigning(false);
    }
  };
  

  return (
    <Button
      onClick={handleSignPetition}
      disabled={isSigning || hasSigned}
      className={`w-full font-bold py-2 px-4 rounded-full transition duration-200 ${
        isSigning || hasSigned ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500 text-white hover:bg-pink-600'
      }`}
    >
      {hasSigned ? 'You have signed this petition' : isSigning ? 'Signing...' : 'Sign Petition'}
    </Button>
  );
};

export default SignPetitionButton;
