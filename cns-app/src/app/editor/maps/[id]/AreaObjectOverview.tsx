import AreaObjectList from "@/components/lists/AreaObjectList";
import MapDisplayModule from "@/components/displays/MapDisplayModule";
import StatusContextProvider from "@/store/statusContext";
import { Plus } from "lucide-react";
import Link from "next/link";

interface Props {
  settings: {
    mapId: number;
    label: string;
    type: string;
  };
  data: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  };
}

export default async function AreaObjectOverviewModule({
  settings,
  data,
}: Props) {
  let error: string | null = null;

  if (!data.map) {
    error = "Map not found";
  }

  if (!data.mapAreas && !data.mapObjects) {
    error = "No data found";
    return;
  }

  const dataList = () => {
    if (settings.type == "areas") {
      return data?.mapAreas;
    } else if (settings.type == "objects") {
      return data?.mapObjects;
    }
    return [];
  };

  return (
    <StatusContextProvider>
      <div className="w-full grid grid-cols-12 gap-4">
        <div className="col-span-7">
          <MapDisplayModule data={data} settings={settings.type} />
        </div>
        <div className="col-span-5">
          <AreaObjectList
            dataList={dataList()}
            label={settings.label}
            type={settings.type}
            mapId={settings.mapId}
          />
        </div>
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
