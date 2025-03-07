import MapEditor from "@/components/editors/MapEditor";
import prisma from "../../../../../../../prisma/db";

interface MapAreaEditorProps {
  params: {
    id: string;
    objectId: string;
  };
  searchParams: {};
}

const MapAreaEditor = async ({ params }: MapAreaEditorProps) => {
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
};

export default MapAreaEditor;
