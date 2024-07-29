import prisma from "../../../prisma/db";
// import DataTable from "./DataTable";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
// import Pagination from "@/components/Pagination";
// import StatusFilter from "@/components/filters/StatusFilter";
import { Map } from "@prisma/client";
import MapTable from "./MapTable";

export interface SearchParams {
  page: string;
  orderBy: keyof Map;
}

const Maps = async () => {
  const maps = await prisma.map.findMany();
  return (
    <div>
      <MapTable maps={maps} />
    </div>
  );
};

export default Maps;
