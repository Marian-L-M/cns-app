import prisma from "@/../prisma/db";
import EditorContextProvider from "@/store/mapEditorContext";
import StoryEditor from "@/components/editors/StoryEditor";

interface substoryProps {
  params: {
    id: string;
    sid: string;
  };
}

export default async function SubStoryDetailPage({ params }: substoryProps) {
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
      <EditorContextProvider>
        <StoryEditor story={story} substory={substory} map={map} />
      </EditorContextProvider>
    </div>
  );
}
