'use client';

import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Petition } from '@/components/petition/interface';
import { Calendar, MapPin } from 'lucide-react';

type FetchError = {
  message: string;
};

const PetitionList = () => {
  const [data, setData] = useState<Petition[]>([]);
  const [error, setError] = useState<FetchError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: petitions, error: fetchError } = await supabase
          .from('petitions')
          .select('*');

        if (fetchError) {
          throw fetchError;
        }

        setData(petitions);
      } catch (error) {
        console.error('Error fetching data:', (error as FetchError).message);
        setError(error as FetchError);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-red-500">Error: {error.message}</div>
      </main>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-neonPink mb-8 text-center">
        Explore Hottest Topics
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((petition) => (
          <Link key={petition.id} href={`/posts/${petition.id}`}>
            <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-neon transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="relative h-48 w-full">
                <Image
                  src={petition.image}
                  alt={petition.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-2 text-neonBlue">
                  {petition.title}
                </h2>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{petition.location}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    Created: {new Date(petition.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default function PetitionPage() {
  return <PetitionList />;
}
