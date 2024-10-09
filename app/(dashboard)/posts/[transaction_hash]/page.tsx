'use client';

import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Petition } from '@/components/petition/interface';
import SignPetitionButton from '@/components/petition/SignPetitionButton';
import { Progress } from '@/components/ui/progress';
import { Calendar, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
  params: {
    transaction_hash: string; // Ensure to match this with the dynamic route parameter
  };
}

const PetitionDetail: React.FC<Props> = ({ params }) => {
  const [petition, setPetition] = useState<Petition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Function to refetch petition data
  const fetchPetition = async () => {
    try {
      const { data, error } = await supabase
        .from('petitions')
        .select('*')
        .eq('transaction_hash', params.transaction_hash) // Use the correct column name
        .single();

      if (error) {
        throw error;
      }

      // Make sure to check if data is returned and it has votes and target
      if (data) {
        setPetition(data as Petition);
        if (data.target > 0) { // Avoid division by zero
          setProgress((data.votes / data.target) * 100);
        }
      } else {
        throw new Error('No petition found');
      }
    } catch (err: any) {
      console.error('Error fetching petition:', err.message);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPetition();
  }, [params.transaction_hash]);

  console.log('Transaction Hash:', params.transaction_hash);

  // Handle error by returning a 404 response
  if (error) {
    return notFound(); // Redirects to the 404 page
  }

  // Show loading state while fetching data
  if (!petition) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-white">Loading...</div>
      </main>
    );
  }

  // Main rendering of petition details
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-neon">
        <div className="relative h-64 w-full">
          <Image
            src={petition.image}
            alt={petition.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-neonPink">
            {petition.title}
          </h1>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{petition.location}</span>
            <Calendar className="mx-4 h-4 w-4" />
            <span>
              Created: {new Date(petition.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-lg mb-6">{petition.description}</p>
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>{petition.votes} have signed</span>
              <span>Goal: {petition.target}</span>
            </div>
            <Progress value={progress} />
          </div>
          <SignPetitionButton petitionId={petition.petition_id} onSignSuccess={fetchPetition} />
        </div>
      </div>
    </div>
  );
};

export default PetitionDetail;