import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requireAuthorOrAdmin } from "@/lib/auth-guards";

export default async function Maps() {
  const session = await requireAuthorOrAdmin();

  return (
    <div className="w-full">
      <div
        className="flex border-b p-2 border-b-slate-200  justify-between items-center"
        id="title-row"
      >
        <h1>Stories</h1>
        <div id="actions">
          <Button asChild>
            <Link href={"/editor/stories/create"}>Create</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
