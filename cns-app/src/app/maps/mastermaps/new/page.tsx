import MasterMapEditor from "@/components/editors/MasterMapEditor";
import CursorContextProvider from "@/store/cursorContext";
import { fetchMasterMap } from "@/lib/fetchMapData";

async function MasterMapEditorPage() {
  const MasterMap = await fetchMasterMap("1");

  return (
    <CursorContextProvider>
      <MasterMapEditor MasterMap={MasterMap} />
    </CursorContextProvider>
  );
}

export default MasterMapEditorPage;
