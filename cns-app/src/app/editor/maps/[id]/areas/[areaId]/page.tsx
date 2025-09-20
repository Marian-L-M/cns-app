import MapEditorModule from "@/components/maps/MapEditorModule";
import { fetchMapAuthorId } from "@/lib/fetchMapData";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import prisma from "@/../prisma/db";
import EditorContextProvider from "@/store/mapEditorContext";

interface MapAreaEditorProps {
  params: {
    id: string;
    areaId: string;
  };
  searchParams: {};
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
  const mapAuthors = await fetchMapAuthorId(id);
  const session = await requireOwnerOrAdmin({ authors: mapAuthors.authors });

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
      <MapEditorModule map={map} globalArea={area} />
    </EditorContextProvider>
  );
}
