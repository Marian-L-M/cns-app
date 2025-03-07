import SubstoryEditor from "@/components/editors/SubstoryEditor";
import prisma from "../../../../../../prisma/db";

interface substoryProps {
  params: {
    id: string;
    sid: string;
  };
}

async function substoryDetailPage({ params }: substoryProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const entry = await prisma.entry.findUnique({
    where: { id: id },
  });

  if (!entry) {
    return <div>Story not found</div>;
  }
  if (!entry.assignedToMapID) {
    return <div>No associated map</div>;
  }

  // fetch map
  const map = await prisma.map.findUnique({
    where: { id: entry.assignedToMapID },
  });

  if (!map) {
    return <div>Map not found</div>;
  }

  return (
    <div className="w-full" id="substory-detail-page">
      <SubstoryEditor entry={entry} map={map} />
    </div>
  );
}

export default substoryDetailPage;
