import { Map } from "@prisma/client";
import MapCard from "./MapCard";

interface Props {
  maps: Map[];
}

export default function MapCardTable({ maps }: Props) {
  return (
    <div className="w-full rounded-md grid grid-cols-5 gap-4 border  p-4">
      {maps &&
        maps.map((map) => (
          <MapCard map={map} key={`featured-article-${map.id}`} />
        ))}
      {maps.length == 0 && <h2>No maps found</h2>}
    </div>
  );
}
