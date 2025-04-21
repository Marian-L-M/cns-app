import { getLatestMaps } from "@/lib/actions/map.actions";
import MapTable from "./MapTable";

const Maps = async () => {
  const maps = await getLatestMaps(9);

  return (
    <div>
      <MapTable maps={maps} />
    </div>
  );
};

export default Maps;
