import prisma from "@/../prisma/db";
import EditorContextProvider from "@/store/mapEditorContext";
import StoryEditor from "@/components/editors/StoryEditor";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";

interface substoryProps {
  params: Promise<{
    id: string;
    sid: string;
  }>;
}

export default async function SubStoryDetailPage({ params }: substoryProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const sid = parseInt(resolvedParams.sid);

  const story = await prisma.story.findUnique({
    where: { id: id },
    include: {
      userStories: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
            },
          },
        },
      },
    },
  });

  const substory = await prisma.subStory.findUnique({
    where: { id: sid },
    include: {
      canvasStyles: true,
    },
  });

  if (!story) {
    return <div>Story not found</div>;
  }

  // Check if current user has permission to edit current story
  const session = await requireOwnerOrAdmin({
    userJunction: story.userStories,
  });

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

  // Dirty fix for bad DB schema
  const subStoryData = {
    ...substory,
    nodes: substory.nodes as StoryNode[],
  };

  return (
    <div className="w-full" id="substory-detail-page">
      <EditorContextProvider>
        <StoryEditor story={story} substory={subStoryData} map={map} />
      </EditorContextProvider>
    </div>
  );
}
