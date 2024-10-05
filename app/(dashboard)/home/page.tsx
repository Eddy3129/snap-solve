// app/(dashboard)/home/page.tsx

'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react';
import { MapProps } from '@/components/Map';
import { Popup } from '@/components/styles/Popup';

const HomePage: React.FC = () => {
  const [isShowPopup, setIsShowPopup] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showCircle, setShowCircle] = useState(false);

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
        setUserLocation({ lat: latitude, lng: longitude });
        setShowCircle(true);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  };

  // Handle clicking on the map to hide the blue circle
  useEffect(() => {
    if (!mapInstance) return;

    const handleMapClick = () => {
      setShowCircle(false);
    };

    mapInstance.on('click', handleMapClick);

    return () => {
      mapInstance.off('click', handleMapClick);
    };
  }, [mapInstance]);

  return (
    <>
      <div className="w-4/5 max-w-7xl mx-auto p-6 text-3xl mt-1 relative" style={{ zIndex: 0 }}>
        <h1 className="text-center orbitron">Explore happenings around you</h1>

        {/* Map Container */}
        <div className="rounded-lg overflow-hidden shadow-neon mt-5 relative" style={{ zIndex: 0 }}>
          <Map setMapInstance={setMapInstance} />

          {/* User Location Icon */}
          {userLocation && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                top: `${userLocation.lat}%`,
                left: `${userLocation.lng}%`,
                zIndex: 10,
              }}
            >
              <svg
                className="w-8 h-8 text-neonPink"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
            </div>
          )}

          {/* Blue Circle Range */}
          {showCircle && userLocation && (
            <div
              className="absolute border-2 border-blue-500 rounded-full animate-pulse"
              style={{
                top: `${userLocation.lat}%`,
                left: `${userLocation.lng}%`,
                width: '100px',
                height: '100px',
                marginLeft: '-50px',
                marginTop: '-50px',
                zIndex: 5,
              }}
            ></div>
          )}
        </div>
      </div>
      {isShowPopup && <Popup togglePopup={togglePopup} />}
    </>
  );
};

export default HomePage;
