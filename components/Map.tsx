import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { supabase } from "@/lib/supabase"; // Adjust path as necessary
import Link from "next/link";
import { Petition } from "./ui/petition/interface";
import { GestureHandling } from "leaflet-gesture-handling";

const URL = 'https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token=JtQLIXuMKOcBiq1pNbolzpRJu7XtGSaFE5N5zeniUVA6rUg3PK15PB3XVOLGb4K7';
const ATTRIBUTION = '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Default map position and zoom level
const position: [number, number] = [3.140853, 101.693207];
const zoom = 14;

// Define the custom icon
var alertIcon = L.icon({
  iconUrl: '/Alert.png',
  iconSize: [40, 40],   
  iconAnchor: [22, 94], 
  popupAnchor: [-3, -76] 
});


const MyMap: React.FC = () => {
  // State to hold petitions data with type annotation
  const [petitions, setPetitions] = useState<Petition[]>([]);

  useEffect(() => {
    // Fetch data from Supabase on component mount
    const fetchData = async () => {
      try {
        // Fetch petitions data with Supabase query
        const { data, error } = await supabase.from("petitions").select("*");
        if (error) throw error;

        // Set petitions data to state
        setPetitions(data || []); // Default to an empty array if no data
      } catch (error: any) {
        console.error("Error fetching petitions:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <MapContainer center={position} zoom={zoom} scrollWheelZoom={true} id="map">
        <TileLayer url={URL} attribution={ATTRIBUTION} />

        {/* Map over petitions to create markers */}
        {petitions.map((petition) => (
          <Marker key={petition.id} position={[petition.latitude, petition.longitude]} icon={alertIcon}>
            <Popup>
              <div>
                <strong>{petition.title}</strong>
                <br />
                <Link href={`/posts/${petition.id}`}>
                  View Post
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MyMap;
