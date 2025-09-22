import EditorContextProvider from "@/store/mapEditorContext";
import { fetchMapAuthorId, fetchMapData } from "@/lib/fetchMapData";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import MapAreaEditorModule from "@/components/maps/MapAreaEditorModule";
interface MapAreaEditorProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: {};
}

export default async function NewMapAreaEditor({ params }: MapAreaEditorProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return <div>Invalid map ID</div>;
  }

  // Check if current user has permission to edit
  const mapData = await fetchMapAuthorId(id);
  const session = await requireOwnerOrAdmin({ userJunction: mapData.userMaps });

  const { map } = await fetchMapData(id);

  return (
    <EditorContextProvider>
      <MapAreaEditorModule map={map} />
    </EditorContextProvider>
  );
}
