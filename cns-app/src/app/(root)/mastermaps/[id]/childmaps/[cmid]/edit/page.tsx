import ChildMapEditor from "@/components/editors/ChildMapEditor";
import { fetchHierarchyChild, fetchMasterMap } from "@/lib/fetchMapData";
import CursorContextProvider from "@/store/cursorContext";

// Todo: Fetiching with both ids seems innefficent
interface MapPageProps {
  params: { id: string; cmid: string };
}

export default async function MasterMapEditorPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const { id, cmid } = resolvedParams;

  const masterMap = await fetchMasterMap(
    typeof id == "string" ? parseInt(id) : id
  );
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
