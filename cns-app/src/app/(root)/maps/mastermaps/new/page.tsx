import MasterMapEditor from "@/components/editors/MasterMapEditor";
import CursorContextProvider from "@/store/cursorContext";
import { fetchMasterMap } from "@/lib/fetchMapData";

async function MasterMapEditorPage() {
  return (
    <CursorContextProvider>
      <MasterMapEditor />
    </CursorContextProvider>
  );
}

export default MasterMapEditorPage;
