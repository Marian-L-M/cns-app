import MapEditorModule from "@/components/maps/MapEditorModule";
import EditorContextProvider from "@/store/mapEditorContext";
import { GlobalArea } from "@prisma/client";

interface Props {
  id: number;
  area?: GlobalArea;
}

const MapEditor = ({ id, area }: Props) => {
  return (
    <EditorContextProvider>
      <MapEditorModule mapId={id} globalArea={area} />
    </EditorContextProvider>
  );
};

export default MapEditor;

// 241024 To do
// Split MapEditor into two:
// Map Area Editor and Map Object Editor
