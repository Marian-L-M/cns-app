import { Entry } from "@prisma/client";
import { fetchMapData } from "@/lib/fetchMapData";
import { fetchStoryData } from "@/lib/fetchStoryData";
import StatusContextProvider from "@/store/statusContext";
import StoryModule from "@/components/maps/StoryModule";

interface Props {
  story: Entry;
}

const StoryDetail = async ({ story }: Props) => {
  let mapData: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;

  // fetch map
  try {
    // 240819 This is stupid - change fetchMapData to always expect an integer
    mapData = await fetchMapData(story.assignedToMapID?.toString() || "");

    if (!mapData.map) {
      error = "Map not found";
    }
  } catch (err) {
    error = "Failed to fetch data";
  }

  // fetch story
  let storyData: story[] = [];

  try {
    const fetchedStoryData = await fetchStoryData(story.id);

    if (!fetchedStoryData.story || fetchedStoryData.story.length === 0) {
      throw new Error("No story found");
    } else {
      storyData = fetchedStoryData.story;
    }
  } catch (err) {
    error = (err as Error).message || "Failed to fetch story";
  }

  // 240819 To Do 2: Hook up stories
  // 240820 Unify MapModule logic and StoryModule logic
  return (
    <div>
      <StatusContextProvider>
        {storyData?.length > 0 ? (
          <StoryModule data={mapData} story={storyData} />
        ) : (
          <div>{error || "An error occurred"}</div>
        )}
      </StatusContextProvider>
    </div>
  );
};

export default StoryDetail;
