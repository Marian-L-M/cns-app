import dynamic from "next/dynamic";
import prisma from "../../../../prisma/db";

interface Props {
  params: { id: string };
}

const StoryForm = dynamic(() => import("@/components/forms/StoryForm"), {
  ssr: false,
});

const EditStory = async ({ params }: Props) => {
  const story = await prisma?.entry.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!story) {
    return <p className="text-destructive">Story not found</p>;
  }
  return <StoryForm story={story} />;
};

export default EditStory;
