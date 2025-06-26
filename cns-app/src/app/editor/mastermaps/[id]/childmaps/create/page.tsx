import ChildMapEditor from "@/components/editors/ChildMapEditor";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import { fetchMasterMap } from "@/lib/fetchMapData";
import CursorContextProvider from "@/store/cursorContext";

interface MapPageProps {
  params: { id: string };
}

export default async function MasterMapEditorPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const masterMap = await fetchMasterMap(
    typeof id == "string" ? parseInt(id) : id
  );
  const session = await requireOwnerOrAdmin({ authors: masterMap?.authors });

  if (!masterMap) {
    return <div className="text-destructive">No maps found</div>;
  } else if (!session) {
    return <div className="text-destructive">No user data found found</div>;
  }

  return (
    <CursorContextProvider>
      <ChildMapEditor MasterMap={masterMap} />
    </CursorContextProvider>
  );
}
