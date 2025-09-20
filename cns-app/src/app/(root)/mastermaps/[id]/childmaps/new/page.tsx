import ChildMapEditor from "@/components/editors/ChildMapEditor";
import { fetchMasterMap } from "@/lib/fetchMapData";
import CursorContextProvider from "@/store/cursorContext";

interface MapPageProps {
  params: { id: string };
}

export default async function MasterMapEditorPage({ params }: MapPageProps) {
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
