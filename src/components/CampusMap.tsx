import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

function CampusMap() {
  const [routeData, setRouteData] = useState(null);

  useEffect(() => {
    fetch("/data/unilag-paths.geojson")
      .then((response) => response.json())
      .then((data) => {
        setRouteData(data);
        (window as any).campusPaths = data;

        const highwayTypes = data.features.reduce(
            (counts: Record<string, number>, feature) => {
            const type = feature.properties.highway;
            counts[type] = (counts[type] || 0) + 1;
            return counts;
          },
          {},
        );

        console.table(highwayTypes);
    })
      .catch((error) => console.error("Error loading paths:", error));
  }, []);
  return (
    <MapContainer
      center={[6.515, 3.39]}
      zoom={16}
      scrollWheelZoom={true}
      style={{ height: "70vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {routeData && <GeoJSON data={routeData} />}
    </MapContainer>
  );
}

export default CampusMap;

// MapContainer creates the interactive map.
// center sets the initial position around UNILAG.
// zoom={16} controls the initial zoom level.
// TileLayer loads the actual map imagery from OpenStreetMap.
// style gives the map a visible height. Without a height, the map may not appear.

// useState stores the GeoJSON data.
// useEffect fetches the file when the component mounts.
// setPathData(data) saves the retrieved data.
// <GeoJSON> renders the geographical features on Leaflet.
