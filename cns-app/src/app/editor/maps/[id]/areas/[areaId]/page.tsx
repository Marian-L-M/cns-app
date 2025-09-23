import { fetchMapAuthorId } from "@/lib/fetchMapData";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import prisma from "@/../prisma/db";
import EditorContextProvider from "@/store/mapEditorContext";
import MapAreaEditorModule from "@/components/maps/MapAreaEditorModule";

interface MapAreaEditorProps {
  params: Promise<{
    id: string;
    areaId: string;
  }>;
}

export default async function MapAreaEditor({ params }: MapAreaEditorProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const areaId = parseInt(resolvedParams.areaId);

  // Imperfect validation, will return false even if letters are mixed with numbers
  if (isNaN(id)) {
    return <div>Invalid map ID</div>;
  }
  if (isNaN(areaId)) {
    return <div>Invalid map Area</div>;
  }

  // Check if current user has permission to edit
  const mapData = await fetchMapAuthorId(id);
  const session = await requireOwnerOrAdmin({ userJunction: mapData.userMaps });

  // Get corresponding area and map
  const area = await prisma.globalArea.findUnique({
    where: { id: areaId },
    include: {
      canvasStyles: true,
    },
  });

  const map = await prisma.map.findUnique({
    where: { id: id },
  });

  if (!map) {
    return <div>Map not found</div>;
  }

  if (!area) {
    return <div>Area not found</div>;
  }

  return (
    <EditorContextProvider>
      <MapAreaEditorModule map={map} globalArea={area} />
    </EditorContextProvider>
  );
}
