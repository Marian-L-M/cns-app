import prisma from "@/../prisma/db";
import { fetchMapAuthorId } from "@/lib/fetchMapData";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import EditorContextProvider from "@/store/mapEditorContext";
import MapObjectEditorModule from "@/components/maps/MapObjectEditorModule";

interface MapAreaEditorProps {
  params: Promise<{
    id: string;
    objectId: string;
  }>;
  searchParams: {};
}

export default async function MapAreaEditor({ params }: MapAreaEditorProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const objectId = parseInt(resolvedParams.objectId);

  // Imperfect validation, will return false even if letters are mixed with numbers
  if (isNaN(id)) {
    return <div>Invalid map ID</div>;
  }
  if (isNaN(objectId)) {
    return <div>Invalid map object</div>;
  }

  // Check if current user has permission to edit
  const mapData = await fetchMapAuthorId(id);
  const session = await requireOwnerOrAdmin({ userJunction: mapData.userMaps });

  // Get corresponding Objects and map
  const object = await prisma.globalObject.findUnique({
    where: { id: objectId },
    include: {
      canvasStyles: true,
    },
  });

  const map = await prisma.map.findUnique({
    where: { id: id },
  });

  if (!object) {
    return <div>Object not found</div>;
  }

  return (
    <EditorContextProvider>
      <MapObjectEditorModule map={map} globalObject={object} />
    </EditorContextProvider>
  );
}
