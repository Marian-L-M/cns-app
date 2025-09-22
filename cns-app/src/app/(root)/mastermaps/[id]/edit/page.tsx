import MasterMapEditor from "@/components/editors/MasterMapEditor";
import { fetchMasterMap } from "@/lib/fetchMapData";
import CursorContextProvider from "@/store/cursorContext";

interface MapPageProps {
  params: Promise<{ id: string }>;
}

export default async function MasterMapEditorPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const masterMap = await fetchMasterMap(parseInt(id));
  console.log(masterMap);
  if (!masterMap) {
    return <div className="text-destructive">No maps found</div>;
  }

  return (
    <CursorContextProvider>
      <MasterMapEditor MasterMap={masterMap} />
    </CursorContextProvider>
  );
}
