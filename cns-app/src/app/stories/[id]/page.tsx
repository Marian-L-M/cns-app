import prisma from "../../../../prisma/db";
import StoryDetail from "./StoryDetail";

interface Props {
  params: { id: string };
}

const ViewStory = async ({ params }: Props) => {
  const story = await prisma.entry.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!story) {
    return <div className="text-destructive">Story not found</div>;
  }

  return <StoryDetail story={story} />;
};

export default ViewStory;
