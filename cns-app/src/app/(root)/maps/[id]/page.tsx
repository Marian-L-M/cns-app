import ReactMarkDown from "react-markdown";
import MapDisplayModule from "@/components/displays/MapDisplayModule";
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
    <div className="w-full flex gap-4">
      <div className="col-span-6">
        <StatusContextProvider>
          <MapDisplayModule data={data} />
        </StatusContextProvider>
      </div>
      <div className="col-span-3 flex flex-col gap-4">
        <h2 className="text-2xl">{data.map.title}</h2>
        <ReactMarkDown className={"prose dark:prose-invert text-md"}>
          {data.map.description}
        </ReactMarkDown>
      </div>
    </div>
  );
}
