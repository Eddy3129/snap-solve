// app/(dashboard)/home/page.tsx

'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { MapProps } from '@/components/Map';
import { Popup } from '@/components/styles/Popup';

const HomePage: React.FC = () => {
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);

  const Map = useMemo(
    () =>
      dynamic<MapProps>(() => import('@/components/Map'), {
        loading: () => <p>A map is loading...</p>,
        ssr: false,
      }),
    []
  );

  const togglePopup = () => {
    setIsShowPopup(!isShowPopup);
  };

  const handleSearch = async (query: string) => {
    if (!query || !mapInstance) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const results = await response.json();

      if (results.length > 0) {
        const { lat, lon } = results[0];
        mapInstance.setView([parseFloat(lat), parseFloat(lon)], 14);
      }
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const handleLocateUser = () => {
    if (!mapInstance || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        mapInstance.setView([latitude, longitude], 14);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  };

  return (
    <>
      <div className="w-4/5 max-w-7xl mx-auto p-6" style={{ zIndex: 0 }}>
        <div className="rounded-lg overflow-hidden shadow-neon" style={{ zIndex: 0 }}>
          <Map setMapInstance={setMapInstance} />
        </div>
      </div>
      {isShowPopup && <Popup togglePopup={togglePopup} />}
    </>
  );
}
  

export default HomePage;
