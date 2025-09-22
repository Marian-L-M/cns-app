// Marked for deletion -> superflous
import MapEditorModule from "@/components/maps/MapEditorModule";
import EditorContextProvider from "@/store/mapEditorContext";

interface AreaNode {
  id: number;
  x: number;
  y: number;
}

interface Props {
  mapId: number;
  area?:
    | {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        imageUrl: string;
        infobox: {};
        nodes?: AreaNode[];
        styles: {};
        objectTime: number;
        mapId: number;
        wikiId: number;
        type: "GEOGRAPHY" | "ABSTRACT" | "INTERACTIVE";
      }
    | undefined;
  object?: any;
  editorMode?: string;
}

export default function MapEditor({ mapId, area, object, editorMode }: Props) {
  return (
    <EditorContextProvider>
      <MapEditorModule
        mapId={mapId}
        globalArea={area}
        globalObject={object}
        editorMode={editorMode}
      />
    </EditorContextProvider>
  );
}
