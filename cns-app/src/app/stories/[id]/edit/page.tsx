import prisma from "../../../../../prisma/db";
import StoryEditor from "@/components/editors/StoryEditor";

interface Props {
  params: { id: string };
}

const EditStory = async ({ params }: Props) => {
  const story = await prisma?.entry.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!story) {
    return <p className="text-destructive">Story not found</p>;
  }
  return (
    <div className="w-full" id="story-editor-module">
      <StoryEditor story={story} />
    </div>
  );
};

export default EditStory;
