// Move to utils folder and polish concept
import prisma from "@/../prisma/db";
import axios from "axios";

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

interface StoryFetchProps {
  selectedStoryId: number | undefined;
  setStoryName: React.Dispatch<React.SetStateAction<string>>;
}

export async function fetchStoryName({
  selectedStoryId,
  setStoryName,
}: StoryFetchProps) {
  if (!selectedStoryId) {
    setStoryName("");
    return;
  }

  try {
    const response = await axios.get(`/api/story/${selectedStoryId}`);
    if (response.data && response.data.title) {
      setStoryName(response.data.title);
    }
  } catch (error) {
    console.error("Error fetching mastermap data:", error);
    setStoryName("");
  }
}
