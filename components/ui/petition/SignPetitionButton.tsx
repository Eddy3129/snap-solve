'use client';

import { useState } from 'react';
import { supabase } from "@/lib/supabase";

interface Props {
  petitionId: string;
}

export default function SignPetitionButton({ petitionId }: Props) {
  const [isSigning, setIsSigning] = useState(false);

  const handleSignPetition = async () => {
    setIsSigning(true);
    try {
      // Call the RPC function to increment signatures
      const { data: newSignatureCount, error: incrementError } = await supabase
        .rpc('increment_petition_signatures', { petition_id: parseInt(petitionId) });

      if (incrementError) throw incrementError;

      if (newSignatureCount === null) {
        throw new Error('Failed to increment signature count');
      }

      console.log('Petition signed successfully. New signature count:', newSignatureCount);
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