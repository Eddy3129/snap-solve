// components/Map.tsx

import { MapContainer, Marker, TileLayer, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Petition } from '@/components/petition/interface';

export interface MapProps {
  setMapInstance: (map: L.Map) => void;
}

const URL =
  'https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token=JtQLIXuMKOcBiq1pNbolzpRJu7XtGSaFE5N5zeniUVA6rUg3PK15PB3XVOLGb4K7';
const ATTRIBUTION =
  '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const position: [number, number] = [3.140853, 101.693207];
const zoom = 14;

const alertIcon = L.icon({
  iconUrl: '/Alert.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const MyMap: React.FC<MapProps> = ({ setMapInstance }) => {
  const [petitions, setPetitions] = useState<Petition[]>([]);

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
    const map = useMapEvents({});
    useEffect(() => {
      if (map) {
        setMapInstance(map);
      }
    }, [map]);

    return null;
  };

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={true}
      id="map"
      style={{ height: '500px', width: '100%' }}
    >
      <MapEvents />
      <TileLayer url={URL} attribution={ATTRIBUTION} />
      {petitions.map((petition) => (
        <Marker
          key={petition.id}
          position={[petition.latitude, petition.longitude]}
          icon={alertIcon}
        >
          <Popup>
            <div>
              <strong>{petition.title}</strong>
              <br />
              <Link href={`/posts/${petition.id}`}>View Post</Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MyMap;
