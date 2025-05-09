import MapModule from "@/components/maps/MapModule";
import { fetchMapData } from "@/lib/fetchMapData";
import StatusContextProvider from "@/store/statusContext";

interface MapPageProps {
  params: { id: string };
}

export default async function MapPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  let data: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;

  try {
    data = await fetchMapData(id);

    if (!data.map) {
      error = "Map not found";
    }
  } catch (err) {
    error = "Failed to fetch data";
  }

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }
  return (
    <StatusContextProvider>
      <MapModule data={data} />
    </StatusContextProvider>
  );
}
