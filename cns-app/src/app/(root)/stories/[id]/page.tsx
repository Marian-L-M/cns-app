import prisma from "@/../prisma/db";
import StoryDetail from "./StoryDetail";

export default async function ViewStory({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const idString = resolvedParams.id;

  // Parse the ID and verify it's a valid number
  const idNum = parseInt(idString, 10);

  if (!idString || isNaN(idNum)) {
    return <div className="text-destructive">Invalid story ID</div>;
  }

  const story = await prisma.story.findUnique({
    where: { id: idNum },
  });

  if (!story) {
    return <div className="text-destructive">Story not found</div>;
  }

  return <StoryDetail story={story} />;
}
