import prisma from "../../../prisma/db";
import MapTable from "./MapTable";

const Maps = async () => {
  const maps = await prisma.map.findMany();
  return (
    <div>
      <MapTable maps={maps} />
    </div>
  );
};

export default Maps;
