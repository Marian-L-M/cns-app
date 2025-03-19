import MasterMapEditor from "@/components/editors/MasterMapEditor";
import CursorContextProvider from "@/store/cursorContext";

function MasterMapEditorPage() {
  return (
    <CursorContextProvider>
      <MasterMapEditor />
    </CursorContextProvider>
  );
}

export default MasterMapEditorPage;
