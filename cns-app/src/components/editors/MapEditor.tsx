import MapEditorModule from "@/components/maps/MapEditorModule";
import EditorContextProvider from "@/store/mapEditorContext";

const MapEditor = ({ mapId }: String) => {
  return (
    <EditorContextProvider>
      <MapEditorModule mapId={mapId} />
    </EditorContextProvider>
  );
};

export default MapEditor;

// 241024 To do
// Split MapEditor into two:
// Map Area Editor and Map Object Editor
