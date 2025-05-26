import AreaObjectList from "@/components/lists/AreaObjectList";
import MapDisplayModule from "@/components/maps/MapDisplayModule";
import { fetchMapData } from "@/lib/fetchMapData";
import StatusContextProvider from "@/store/statusContext";
import { Plus } from "lucide-react";
import Link from "next/link";

interface Props {
  settings: {
    mapId: number;
    label: string;
    type: string;
  };
}

// Todo 250526 to do: Area object overview module is not displaying objects -> Map display module bugging, data is passed

export default async function AreaObjectOverviewModule({ settings }: Props) {
  let data: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;

  try {
    data = await fetchMapData(settings.mapId);

    if (!data.map) {
      error = "Map not found";
    }
  } catch (err) {
    error = "Failed to fetch data";
  }

  if (error) {
    return <div className="text-destructive">{error}</div>;
  }
  console.log(data);
  return (
    <StatusContextProvider>
      <div className="w-full grid grid-cols-9 gap-4">
        <MapDisplayModule data={data} />
        <AreaObjectList
          dataList={settings.type == "areas" ? data.mapAreas : data.mapObjects}
          label={settings.label}
          type={settings.type}
          mapId={settings.mapId}
        />
      </div>
      <Link
        href={`/editor/maps/${settings.mapId}/${settings.type}/create`}
        // Create class or component for hover button
        className="fixed right-16 bottom-8 flex align-middle justify-center p-2 bg-indigo-950 text-slate-50 rounded-full hover:opacity-75"
      >
        <Plus width={48} height={48} />
      </Link>
    </StatusContextProvider>
  );
}
