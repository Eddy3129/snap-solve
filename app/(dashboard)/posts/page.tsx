import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

const PetitionList = async () => {
  try {
    console.log("Fetching petition data from Supabase...");
    const { data, error } = await supabase.from("petitions").select("*");
    
    if (error) {
      throw error;
    }
    
    console.log("Data fetched successfully:", data);
    
    return (
      <main className="flex min-h-screen flex-col items-center justify-start p-0">
        <h1 className="text-3xl font-bold mb-2">Explore Hottest Topics</h1>
        <div className="flex flex-wrap justify-center max-w-[80%] max-h-[80vh] overflow-y-auto mt-10 scroll-snap-container">
          {data.map((petition) => (
            <Link key={petition.id} href={`/posts/${petition.id}`}>
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden w-[300px] h-[400px] m-4 transform hover:scale-105 transition-all duration-300 cursor-pointer scroll-snap-align">
                <div className="relative h-48 w-full">
                  <Image 
                    src={petition.image} 
                    alt={petition.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{petition.title}</h2>
                  <h3 className="flex justify-between text-sm text-gray-500">{petition.location}</h3>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Created: {new Date(petition.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    );
  } catch (error:any) {
    console.error("Error fetching data:", error.message);
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-red-500">Error: {error.message}</div>
      </main>
    );
  }
};

export default function PetitionPage() {
  return (
    <div>
      <PetitionList />
    </div>
  );
}
