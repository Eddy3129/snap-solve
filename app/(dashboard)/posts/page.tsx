'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import { Petition } from '@/components/petition/interface';
import { MapPin } from 'lucide-react';
import { useSpring, animated } from 'react-spring';

const PetitionList: React.FC = () => {
  const [data, setData] = useState<Petition[]>([]);
  const [flipped, setFlipped] = useState<{ [key: string]: boolean }>({});
  const [lastClickTime, setLastClickTime] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      const { data: petitions, error } = await supabase
        .from('petitions')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setData(petitions as Petition[]);
    };
    fetchData();
  }, []);

  const handleFlip = (id: string) => {
    const now = Date.now();
    const timeSinceLastClick = now - (lastClickTime[id] || 0);

    if (timeSinceLastClick < 300) {
      // Consecutive clicks within 300ms
      setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    setLastClickTime((prev) => ({ ...prev, [id]: now }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 overflow-hidden">
      <h1 className="text-4xl font-bold text-neonPink mb-8 text-center">
        Explore Hottest Topics
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((petition) => (
          <FlipCard
            key={petition.petition_id}
            petition={petition}
            handleFlip={handleFlip}
            flipped={flipped[petition.petition_id]}
          />
        ))}
      </div>
    </div>
  );
};

const FlipCard: React.FC<{ petition: Petition; handleFlip: (id: string) => void; flipped: boolean }> = ({
  petition,
  handleFlip,
  flipped,
}) => {
  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <div className="relative overflow-hidden rounded-lg" style={{ position: 'relative' }}>
      {/* The card's content that flips */}
      <div
        className="h-[375px] w-[250px] relative overflow-hidden rounded-lg"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName !== 'BUTTON') handleFlip(petition.petition_id);
        }}
      >
        <animated.div
          className="w-full h-full absolute bg-card text-card-foreground rounded-lg overflow-hidden border-2 border-neonPink"
          style={{ opacity: opacity.to((o: number) => 1 - o), transform }}
        >
          {/* Front content */}
          <div className="relative h-[40%] w-full">
            <Image src={petition.image} alt={petition.title} fill style={{ objectFit: 'cover' }} />
          </div>
          <div className="p-4 flex flex-col h-full">
            <h2 className="text-2xl font-semibold text-neonBlue text-center mb-2">
              {petition.title}
            </h2>
            <div className="flex items-center text-sm text-muted-foreground mb-4 justify-center">
              <MapPin className="mr-2 h-12 w-12" />
              <span>{petition.location}</span>
            </div>
          </div>
        </animated.div>

        {/* Back content */}
        <animated.div
          className="w-full h-full absolute bg-card text-card-foreground rounded-lg overflow-hidden p-4"
          style={{
            opacity,
            transform,
            rotateY: '180deg',
          }}
        >
          <h2 className="text-xl font-semibold mb-2 text-neonBlue">{petition.title}</h2>
          <div className="text-xs mb-2">
            <span>Created At: {new Date(petition.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="text-xs mb-2 break-all">
            <span>Petition ID:</span> <br />
            <span>{petition.petition_id}</span>
          </div>
          <div className="text-xs mb-2 break-all">
            <span>Transaction Hash:</span> <br />
            <span>{petition.transaction_hash}</span>
          </div>
        </animated.div>
      </div>

      {/* Button inside the card but positioned at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center z-10 p-4">
        <Link href={`/posts/${petition.petition_id}`}>
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-purple-700 transition cursor-pointer"
            onClick={(e) => e.stopPropagation()} // Prevent card flip when clicking the button
          >
            View Post
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PetitionList;
