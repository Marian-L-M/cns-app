import MapEditor from "@/components/editors/MapEditor";
import prisma from "../../../../../../../prisma/db";

interface MapAreaEditorProps {
  params: {
    id: string;
    areaId: string;
  };
  searchParams: {};
}

const MapAreaEditor = async ({ params }: MapAreaEditorProps) => {
  const awaitedParams = await params;
  const id = parseInt(awaitedParams.id);
  const areaId = parseInt(awaitedParams.areaId);

  // Imperfect validation, will return false even if letters are mixed with numbers
  if (isNaN(id)) {
    return <div>Invalid map ID</div>;
  }
  if (isNaN(areaId)) {
    return <div>Invalid map Area</div>;
  }

  // Get corresponding area
  const area = await prisma.globalArea.findUnique({
    where: { id: areaId },
  });

  if (!area) {
    return <div>Area not found</div>;
  }

  return (
    <div>
      <MapEditor id={id} area={area} />
    </div>
  );
};

export default MapAreaEditor;
