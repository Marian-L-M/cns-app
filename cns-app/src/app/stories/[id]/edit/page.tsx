import StoryForm from "@/components/forms/StoryForm";
import prisma from "@/../prisma/db";

interface Props {
  params: { id: string };
}

const EditStory = async ({ params }: Props) => {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const story = await prisma?.story.findUnique({
    where: { id },
  });

  if (!story) {
    return <p className="text-destructive">Story not found</p>;
  }

  const substories = await prisma.subStory.findMany({
    where: { storyId: story.id },
  });

  return (
    <div className="w-full" id="story-editor-module">
      <StoryForm story={story} substories={substories} />
    </div>
  );
};

export default EditStory;
