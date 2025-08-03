import ChildMapEditor from "@/components/editors/ChildMapEditor";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import { fetchHierarchyChild, fetchMasterMap } from "@/lib/fetchMapData";
import CursorContextProvider from "@/store/cursorContext";

interface MapPageProps {
  params: { id: string; cmid: string };
}

export default async function MasterMapEditorPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const { id, cmid } = resolvedParams;

  const masterMap = await fetchMasterMap(parseInt(id));
  const childMap = await fetchHierarchyChild(cmid);
  const session = await requireOwnerOrAdmin({ authors: masterMap?.authors });

  if (!masterMap || !childMap) {
    return <div className="text-destructive">No map found</div>;
  } else if (!session) {
    return <div className="text-destructive">No user data found found</div>;
  }

  return (
    <CursorContextProvider>
      <ChildMapEditor MasterMap={masterMap} ChildMap={childMap} />
    </CursorContextProvider>
  );
}
