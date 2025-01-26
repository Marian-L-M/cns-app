import StoryForm from "@/components/forms/StoryForm";
import prisma from "../../../../../prisma/db";

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

  const substories = await prisma.story.findMany({
    where: { entryId: entry.id },
  });

  return (
    <div className="w-full" id="story-editor-module">
      {/* This page should be the form for the overall story/entry */}
      {/* <StoryEditor entry={entry} /> */}
      <StoryForm story={entry} substories={substories} />
    </div>
  );
};

export default EditStory;
