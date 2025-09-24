import StoryEditor from "@/components/editors/StoryEditor";
import prisma from "@/../prisma/db";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";

interface SubstoryProps {
  params: Promise<{
    id: string;
    sid: string;
  }>;
}

export default async function SubStoryDetailPage({ params }: SubstoryProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

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

  // Check if current user has permission to edit current story
  const session = await requireOwnerOrAdmin({
    userJunction: story.userStories,
  });

  return (
    <div className="w-full" id="substory-detail-page">
      <StoryEditor story={story} map={map} />
    </div>
  );
}
