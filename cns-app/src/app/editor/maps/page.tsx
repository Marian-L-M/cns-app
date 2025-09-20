import { getLatestMaps } from "@/lib/actions/map.actions";
import MapTable from "./MapTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requireAuthorOrAdmin } from "@/lib/auth-guards";

export default async function Maps() {
  const session = await requireAuthorOrAdmin();
  const maps = await getLatestMaps(9); // Add proper filter functionality

  return (
    <div className="w-full">
      <div
        className="flex border-b p-2 border-b-slate-200  justify-between items-center"
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
