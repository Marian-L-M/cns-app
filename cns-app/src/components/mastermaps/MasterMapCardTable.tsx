import { MapHierarchyMaster } from "@prisma/client";
import MasterMapCard from "./MasterMapCard";

interface Props {
  masterMaps: MapHierarchyMaster[];
}

export default function MasterMapCardTable({ masterMaps }: Props) {
  return (
    <div className="w-full rounded-md grid grid-cols-5 gap-4 border  p-4">
      {masterMaps &&
        masterMaps.map((masterMap) => (
          <MasterMapCard
            masterMap={masterMap}
            key={`mastermap-${masterMap.id}`}
          />
        ))}
    </div>
  );
}
