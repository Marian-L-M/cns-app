import prisma from "../../prisma/db";

export const fetchStoryData = async (entryId: number) => {
  const story = await prisma.story.findMany({
    where: { entryId: entryId },
  });

  return { story };
};
