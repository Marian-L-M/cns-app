import MapEditor from "@/components/editors/MapEditor";
import prisma from "@/../prisma/db";
import { fetchMapAuthorId } from "@/lib/fetchMapData";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";

interface MapAreaEditorProps {
  params: {
    id: string;
    objectId: string;
  };
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
  const mapAuthors = await fetchMapAuthorId(id);
  const session = await requireOwnerOrAdmin({ authors: mapAuthors.authors });

  // Get corresponding area
  const object = await prisma.globalObject.findUnique({
    where: { id: objectId },
  });

  if (!object) {
    return <div>Object not found</div>;
  }

  return (
    <div>
      <MapEditor id={id} object={object} />
    </div>
  );
}
