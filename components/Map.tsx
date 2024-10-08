// components/Map.tsx

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
  Circle,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Petition } from '@/components/petition/interface';
import LocationSearchInput from '@/components/LocationSearchInput';
import { Compass } from 'react-feather';

export interface MapProps {
  setMapInstance: (map: L.Map) => void;
}

const URL =
  'https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token=JtQLIXuMKOcBiq1pNbolzpRJu7XtGSaFE5N5zeniUVA6rUg3PK15PB3XVOLGb4K7';
const ATTRIBUTION =
  '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const position: [number, number] = [3.140853, 101.693207];
const zoom = 14;

// Custom icons
const alertIcon = L.icon({
  iconUrl: '/Alert.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Icon for user location marker
const userIcon = L.icon({
  iconUrl: '/user-location.svg', // Ensure this icon exists in your public folder
  iconSize: [50, 50],
  iconAnchor: [25, 50], // Adjusted for better alignment
  popupAnchor: [0, -50],
});

const MyMap: React.FC<MapProps> = ({ setMapInstance }) => {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [userAccuracy, setUserAccuracy] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('petitions').select('*');
        if (error) throw error;

        setPetitions(data || []);
      } catch (error: any) {
        console.error('Error fetching petitions:', error.message);
      }
    };

    fetchData();
  }, []);

  const MapEvents = () => {
    const map = useMapEvents({
      click: () => {
        // Only dismiss the accuracy circle
        setUserAccuracy(null);
        setErrorMessage(null); // Optionally keep clearing error messages
      },
    });

    useEffect(() => {
      if (map) {
        setMapInstance(map);
        mapRef.current = map;
      }
    }, [map]);

    return null;
  };

  // Handler for location selection from search input
  const handleLocationSelect = (suggestion: { lat: string; lon: string }) => {
    if (mapRef.current) {
      mapRef.current.setView(
        [parseFloat(suggestion.lat), parseFloat(suggestion.lon)],
        14
      );
    }
  };

  // Handler for "Get Location" button click
  const handleGetLocation = useCallback(() => {
    if (!mapRef.current) return;

    mapRef.current.locate({ setView: true });

    const onLocationFound = (e: L.LocationEvent) => {
      const { latlng, accuracy } = e;
      setUserLocation({
        lat: latlng.lat,
        lng: latlng.lng,
      });
      setUserAccuracy(accuracy);
      setErrorMessage(null);
    };

    const onLocationError = (e: L.ErrorEvent) => {
      setErrorMessage(`Geolocation error: ${e.message}`);
    };

    mapRef.current.on('locationfound', onLocationFound);
    mapRef.current.on('locationerror', onLocationError);

    // Clean up listeners on unmount or re-run
    return () => {
      if (mapRef.current) {
        mapRef.current.off('locationfound', onLocationFound);
        mapRef.current.off('locationerror', onLocationError);
      }
    };
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}
      id="map"
      style={{ height: '500px', width: '100%', position: 'relative' }}
    >
      <MapEvents />
      <TileLayer url={URL} attribution={ATTRIBUTION} />
      {/* Position the search box */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '45%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: '300px',
        }}
      >
        <LocationSearchInput onLocationSelect={handleLocationSelect} />
      </div>
      {/* Render existing petition markers */}
      {petitions.map((petition) => (
        <Marker
          key={petition.petition_id}
          position={[Number(petition.latitude), Number(petition.longitude)]}
          icon={alertIcon}
        >
          <Popup>
            <div>
              <strong>{petition.title}</strong>
              <br />
              <Link href={`/posts/${petition.petition_id}`}>View Post</Link>
            </div>
          </Popup>
        </Marker>
      ))}
      {/* Render user location marker */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={userIcon}
        >
          <Popup>
            {userAccuracy
              ? `You are within ${userAccuracy.toFixed(2)} meters from this point.`
              : 'Your location is marked here.'}
          </Popup>
        </Marker>
      )}
      {/* Render accuracy circle if accuracy is available */}
      {userLocation && userAccuracy && (
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          radius={userAccuracy}
          pathOptions={{ color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.2 }}
        />
      )}
      {/* Get Location Button */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        <button
          onClick={handleGetLocation}
          className="neon-button bg-purple-700 text-white p-4 rounded-full shadow-neon hover:bg-neon-pink transition-transform duration-300 transform scale-110 mr-5 mb-5"
          title="Get My Location"
        >
          <Compass size={40} color="#ffffff" />
        </button>
      </div>
      {/* Display error message */}
      {errorMessage && (
        <div className="absolute bottom-24 right-5 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-10">
          {errorMessage}
        </div>
      )}
    </MapContainer>
  );
};

export default MyMap;
