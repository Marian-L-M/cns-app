import MapModule from "@/components/maps/MapModule";
import { fetchMapData } from "@/lib/fetchMapData";

interface MapPageProps {
  params: { id: string };
}

const MapPage = async ({ params }: MapPageProps) => {
  const { id } = params;
  let map: MapType | null = null;
  let mapAreas: GlobalAreaType[] = [];
  let mapObjects: GlobalObjectType[] = [];
  let error: string | null = null;

  try {
    const data = await fetchMapData(id);
    map = data.map;
    mapAreas = data.mapAreas;
    mapObjects = data.mapObjects;

    if (!map) {
      error = "Map not found";
    }
  } catch (err) {
    error = "Failed to fetch data";
  }

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }

  console.log(mapAreas);
  console.log(mapObjects);
  // return <MapModule map={map} mapAreas={mapAreas} mapObjects={mapObjects} />;

  // 240807 Pass data object instead and destructed in MapModule
  return <MapModule map={map} mapObjects={mapObjects} mapAreas={mapAreas} />;
};

export default MapPage;
