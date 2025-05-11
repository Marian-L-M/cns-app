// Move to utils folder and polish concept
import prisma from "@/../prisma/db";

/**
 * Accepts a story id to return all related substories
 * @param {number} storyId - The ID of the story(former entry) to fetch related stories for.
 * @returns {Promise<{ story: Array<any> }>} A promise resolving to an object containing an array of substories.
 */
export async function fetchSubStoryData(storyId: number) {
  const subStory = await prisma.subStory.findMany({
    where: { storyId: storyId },
  });

  return { subStory };
}
