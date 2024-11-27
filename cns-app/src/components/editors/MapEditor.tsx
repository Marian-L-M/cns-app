import MapEditorModule from "@/components/maps/MapEditorModule";
import EditorContextProvider from "@/store/mapEditorContext";

interface areaNode {
  id: number;
  x: number;
  y: number;
}

interface Props {
  id: number;
  area?:
    | {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        imageUrl: string;
        infobox: {};
        nodes?: areaNode[];
        styles: {};
        objectTime: number;
        mapId: number;
        wikiId: number;
        type: "GEOGRAPHY" | "ABSTRACT" | "INTERACTIVE";
      }
    | undefined;
  object?: any;
}

const MapEditor = ({ id, area, object }: Props) => {
  return (
    <EditorContextProvider>
      <MapEditorModule mapId={id} globalArea={area} globalObject={object} />
    </EditorContextProvider>
  );
};

export default MapEditor;

// 241024 To do
// Split MapEditor into two:
// Map Area Editor and Map Object Editor
