import MapEditorModule from "@/components/maps/MapEditorModule";
import EditorContextProvider from "@/store/mapEditorContext";
import { fetchMapAuthorId, fetchMapData } from "@/lib/fetchMapData";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
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

  // Check if current user has permission to edit
  const mapAuthors = await fetchMapAuthorId(id);
  const session = await requireOwnerOrAdmin({ authors: mapAuthors.authors });

  const { map, mapAreas } = await fetchMapData(id);

  return (
    <EditorContextProvider>
      <MapEditorModule map={map} globalArea={mapAreas} editorMode={"area"} />
    </EditorContextProvider>
  );
}
