import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import { fetchMapAuthorId, fetchMapData } from "@/lib/fetchMapData";
import MapEditorModule from "@/components/maps/MapEditorModule";
import EditorContextProvider from "@/store/mapEditorContext";

interface Props {
  params: {
    id: string;
  };
}

export default async function AddMapObject({ params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return <div>Invalid map ID</div>;
  }

  // Check if current user has permission to edit
  const mapAuthors = await fetchMapAuthorId(id);
  const session = await requireOwnerOrAdmin({ authors: mapAuthors.authors });

  const { map, mapObjects } = await fetchMapData(id);

  return (
    <EditorContextProvider>
      <MapEditorModule
        map={map}
        globalObject={mapObjects}
        editorMode={"object"}
      />
    </EditorContextProvider>
  );
}

// 250109 Issue: Icon is not rendered on initial selection of thumbnail
