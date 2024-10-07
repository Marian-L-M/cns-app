import MapEditorModule from "@/components/maps/MapEditorModule";
import EditorContextProvider from "@/store/mapEditorContext";

function createMap() {
  return (
    <EditorContextProvider>
      <MapEditorModule />
    </EditorContextProvider>
  );
}

export default createMap;
