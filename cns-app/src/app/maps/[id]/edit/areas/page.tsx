import MapModule from "@/components/maps/MapAreaModule";
import { fetchMapData } from "@/lib/fetchMapData";
import StatusContextProvider from "@/store/statusContext";
import { Plus } from "lucide-react";
import Link from "next/link";

interface Props {
  params: { id: string };
}

const EditMapAreas = async ({ params }: Props) => {
  const awaitedParams = await params;
  const { id } = awaitedParams;
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
      <MapModule data={data} />;
      <Link
        href={`/maps/${id}/edit/areas/add`}
        className="fixed right-16 bottom-8 flex align-middle justify-center p-2 bg-indigo-950 text-slate-50 rounded-full hover:opacity-75"
      >
        <Plus width={48} height={48} />
      </Link>
    </StatusContextProvider>
  );
};

export default EditMapAreas;
