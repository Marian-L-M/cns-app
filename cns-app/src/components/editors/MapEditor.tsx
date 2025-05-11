import MapEditorModule from "@/components/maps/MapEditorModule";
import EditorContextProvider from "@/store/mapEditorContext";

interface AreaNode {
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

export default function MapEditor({ id, area, object, editorMode }: Props) {
  return (
    <EditorContextProvider>
      <MapEditorModule
        mapId={id}
        globalArea={area}
        globalObject={object}
        editorMode={editorMode}
      />
    </EditorContextProvider>
  );
}

// 241024 To do
// Split MapEditor into two:
// Map Area Editor and Map Object Editor

// 250109 The whole editor -> mapeditormodule -> usemapeditor structure is a mess
// Fix structure and inconsiten naming pattern
