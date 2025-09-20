import MasterMapEditor from "@/components/editors/MasterMapEditor";
import { fetchMasterMap } from "@/lib/fetchMapData";
import CursorContextProvider from "@/store/cursorContext";

interface MapPageProps {
  params: { id: string };
}

export default async function MasterMapEditorPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  console.log(params);

  const masterMap = await fetchMasterMap(id);
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
