import MasterMapEditor from "@/components/editors/MasterMapEditor";
import CursorContextProvider from "@/store/cursorContext";
import { fetchMasterMap } from "@/lib/fetchMapData";
import ChildMapEditor from "@/components/editors/ChildMapEditor";

interface MapPageProps {
  params: { id: string };
}

async function MasterMapEditorPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const masterMap = await fetchMasterMap(id);

  if (!masterMap) {
    return <div className="text-destructive">No maps found</div>;
  }

  return (
    <CursorContextProvider>
      <ChildMapEditor MasterMap={masterMap} />
    </CursorContextProvider>
  );
}

export default MasterMapEditorPage;
