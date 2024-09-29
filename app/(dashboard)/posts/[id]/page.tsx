// app/posts/[id]/page.tsx

import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Petition } from "@/components/ui/petition/interface";
import SignPetitionButton from "@/components/ui/petition/SignPetitionButton";

interface Props {
  params: {
    id: string;
  };
}

async function getPetition(id: string): Promise<Petition> {
  const { data, error } = await supabase
    .from("petitions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Petition;
}

export default async function PetitionDetail({ params }: Props) {
  try {
    const petition = await getPetition(params.id);

    return (
      <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="relative h-48 w-full">
          <Image 
            src={petition.image} 
            alt={petition.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="p-4">
          <h1 className="text-xl font-bold mb-2">{petition.title}</h1>
          <p className="text-gray-700 text-sm mb-4">{petition.description}</p>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>{petition.signatures} have signed</span>
              <span>Goal: {petition.goal}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${(petition.signatures / petition.goal) * 100}%` }}
              ></div>
            </div>
          </div>
          <SignPetitionButton petitionId={params.id} />
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
}