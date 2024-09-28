// src/components/Map.tsx

import { MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet-providers" 

const position: [number,number] = [51.505, -0.09]
const zoom = 14

const URL = 'https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token=JtQLIXuMKOcBiq1pNbolzpRJu7XtGSaFE5N5zeniUVA6rUg3PK15PB3XVOLGb4K7'
const ATTRIBUTION = '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'


export default function MyMap() {

  return (
    <div style={{ width: '100%', height: '500px' }}> 
      <MapContainer center={position} zoom={zoom} scrollWheelZoom={false} id="map">
        <TileLayer
          url={URL} attribution={ATTRIBUTION}
        />
        <Marker position={position}>
        </Marker>
      </MapContainer>
    </div>
  );
}