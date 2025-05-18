import MapEditorModule from "@/components/maps/MapEditorModule";
import EditorContextProvider from "@/store/mapEditorContext";
import { fetchMapData } from "@/lib/fetchMapData";
interface MapAreaEditorProps {
  params: {
    id: string;
  };
  searchParams: {};
}

export default async function NewMapAreaEditor({ params }: MapAreaEditorProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return <div>Invalid map ID</div>;
  }

  const { map, mapAreas } = await fetchMapData(id);

  return (
    <EditorContextProvider>
      <MapEditorModule map={map} globalArea={mapAreas} editorMode={"area"} />
    </EditorContextProvider>
  );
}
