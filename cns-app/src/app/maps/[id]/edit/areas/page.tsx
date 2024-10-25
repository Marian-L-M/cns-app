import MapModule from "@/components/maps/MapAreaModule";
import { fetchMapData } from "@/lib/fetchMapData";
import StatusContextProvider from "@/store/statusContext";

interface Props {
  params: { id: string };
}

const EditMapAreas = async ({ params }: Props) => {
  const { id } = params;
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
      <MapModule id={id} data={data} />;
    </StatusContextProvider>
  );
};

export default EditMapAreas;
