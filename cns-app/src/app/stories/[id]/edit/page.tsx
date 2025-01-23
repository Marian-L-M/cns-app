import prisma from "../../../../../prisma/db";
import StoryEditor from "@/components/editors/StoryEditor";

interface Props {
  params: { id: string };
}

const EditStory = async ({ params }: Props) => {
  const entry = await prisma?.entry.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!entry) {
    return <p className="text-destructive">Entry not found</p>;
  }
  return (
    <div className="w-full" id="story-editor-module">
      <StoryEditor entry={entry} />
    </div>
  );
};

export default EditStory;
