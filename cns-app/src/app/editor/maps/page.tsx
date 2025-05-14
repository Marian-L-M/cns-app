import { getLatestMaps } from "@/lib/actions/map.actions";
import MapTable from "./MapTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Maps() {
  const maps = await getLatestMaps(9);

  return (
    <div className="w-full">
      <div
        className="flex border-b-2 pb-4 border-b-slate-700  justify-between items-center"
        id="title-row"
      >
        <h1>Maps</h1>
        <div id="actions">
          <Button asChild>
            <Link href={"/editor/maps/create"}>Create</Link>
          </Button>
        </div>
      </div>
      <MapTable maps={maps} />
    </div>
  );
}
