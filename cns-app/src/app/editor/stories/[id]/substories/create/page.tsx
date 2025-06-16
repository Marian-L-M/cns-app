import SubStoryEditor from "@/components/editors/SubstoryEditor";
import prisma from "@/../prisma/db";

interface SubstoryProps {
  params: {
    id: string;
    sid: string;
  };
}

export default async function SubStoryDetailPage({ params }: SubstoryProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const story = await prisma.story.findUnique({
    where: { id: id },
  });

  if (!story) {
    return <div>Story not found</div>;
  }
  if (!story.assignedToMapID) {
    return <div>No associated map</div>;
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
      <SubStoryEditor story={story} map={map} />
    </div>
  );
}
