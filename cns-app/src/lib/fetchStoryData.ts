// Move to utils folder and polish concept
import prisma from "@/../prisma/db";

/**
 * Accepts an entry id to return all related stories
 * @param {number} entryId - The ID of the entry to fetch related stories for.
 * @returns {Promise<{ story: Array<any> }>} A promise resolving to an object containing an array of stories.
 */
export const fetchSubStoryData = async (entryId: number) => {
  const subStory = await prisma.subStory.findMany({
    where: { entryId: entryId },
  });

  return { subStory };
};
