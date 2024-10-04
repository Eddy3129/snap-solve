import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Petition } from '@/components/petition/interface';
import SignPetitionButton from '@/components/petition/SignPetitionButton';
import { Progress } from '@/components/ui/progress';
import { Calendar, MapPin } from 'lucide-react';

interface Props {
  params: {
    id: string;
  };
}

async function getPetition(id: string): Promise<Petition> {
  const { data, error } = await supabase
    .from('petitions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Petition;
}

export default async function PetitionDetail({ params }: Props) {
  try {
    const petition = await getPetition(params.id);

    const progress = (petition.signatures / petition.goal) * 100;

    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-card text-card-foreground rounded-lg overflow-hidden shadow-neon">
          <div className="relative h-64 w-full">
            <Image
              src={petition.image}
              alt={petition.title}
              layout="fill"
              objectFit="cover"
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
                <span>{petition.signatures} have signed</span>
                <span>Goal: {petition.goal}</span>
              </div>
              <Progress value={progress} />
            </div>
            <SignPetitionButton petitionId={params.id} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}
