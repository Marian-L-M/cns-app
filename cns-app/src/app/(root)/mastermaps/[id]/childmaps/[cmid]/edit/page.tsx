import CursorContextProvider from "@/store/cursorContext";
import { fetchHierarchyChild, fetchMasterMap } from "@/lib/fetchMapData";
import ChildMapEditor from "@/components/editors/ChildMapEditor";

interface MapPageProps {
  params: { id: string; cmid: string };
}

async function MasterMapEditorPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const { id, cmid } = resolvedParams;

  const masterMap = await fetchMasterMap(id);
  const childMap = await fetchHierarchyChild(cmid);

  if (!masterMap || !childMap) {
    return <div className="text-destructive">No map found</div>;
  }

  return (
    <CursorContextProvider>
      <ChildMapEditor MasterMap={masterMap} ChildMap={childMap} />
    </CursorContextProvider>
  );
}

export default MasterMapEditorPage;
