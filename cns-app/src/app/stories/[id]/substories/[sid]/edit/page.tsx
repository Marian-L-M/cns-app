import SubStoryEditor from "@/components/editors/SubStoryEditor";
import prisma from "@/../prisma/db";

interface substoryProps {
  params: {
    id: string;
    sid: string;
  };
}

async function substoryDetailPage({ params }: substoryProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const sid = parseInt(resolvedParams.sid);

  const story = await prisma.story.findUnique({
    where: { id: id },
  });

  const substory = await prisma.subStory.findUnique({
    where: { id: sid },
  });

  if (!story) {
    return <div>Story not found</div>;
  }
  if (!story.assignedToMapID) {
    return <div>No associated map</div>;
  }
  if (!substory) {
    return <div>Substory not found</div>;
  }

  // fetch map
  const map = await prisma.map.findUnique({
    where: { id: story.assignedToMapID },
  });

  if (!map) {
    return <div>Map not found</div>;
  }

  return (
    <div className="w-full" id="substory-detail-page">
      <SubstoryEditor story={story} substory={substory} map={map} />
    </div>
  );
}

export default substoryDetailPage;
