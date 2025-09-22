import prisma from "@/../prisma/db";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import { fetchMapAuthorId } from "@/lib/fetchMapData";
import EditorContextProvider from "@/store/mapEditorContext";
import MapObjectEditorModule from "@/components/maps/MapObjectEditorModule";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AddMapObject({ params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return <div>Invalid map ID</div>;
  }

  // Check if current user has permission to edit
  const mapData = await fetchMapAuthorId(id);
  const session = await requireOwnerOrAdmin({ userJunction: mapData.userMaps });

  const map = await prisma.map.findUnique({
    where: { id: id },
  });

  return (
    <EditorContextProvider>
      <MapObjectEditorModule map={map} />
    </EditorContextProvider>
  );
}
