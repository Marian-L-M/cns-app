import StoryForm from "@/components/forms/StoryForm";
import prisma from "@/../prisma/db";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";

interface Props {
  params: { id: string };
}

export default async function EditStory({ params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const story = await prisma?.story.findUnique({
    where: { id },
    include: {
      authors: true,
    },
  });

  if (!story) {
    return <p className="text-destructive">Story not found</p>;
  }

  const substories = await prisma.subStory.findMany({
    where: { storyId: story.id },
  });

  // Check if current user has permission to edit
  const session = await requireOwnerOrAdmin({ authors: story.authors });

  return (
    <div className="w-full" id="story-editor-module">
      <StoryForm story={story} substories={substories} user={session.user} />
    </div>
  );
}
