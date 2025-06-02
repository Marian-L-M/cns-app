import MasterMapEditor from "@/components/editors/MasterMapEditor";
import CursorContextProvider from "@/store/cursorContext";

export default async function MasterMapEditorPage() {
  return (
    <CursorContextProvider>
      <MasterMapEditor />
    </CursorContextProvider>
  );
}
