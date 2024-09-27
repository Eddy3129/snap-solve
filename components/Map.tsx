// src/components/Map.tsx

import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"

const position: [number,number] = [51.505, -0.09]
const zoom = 13


export default function MyMap() {

  return (
    <div style={{ width: '100%', height: '600px' }}> 
      <MapContainer center={position} zoom={zoom} scrollWheelZoom={false} id="map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
        </Marker>
      </MapContainer>
    </div>
  );
}