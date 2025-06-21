import { fetchMapData } from "@/lib/fetchMapData";
import { Story } from "@prisma/client";
import StatusContextProvider from "@/store/statusContext";

import StoryDisplayModule from "@/components/displays/StoryDisplayModule";
import prisma from "@/../prisma/db";

interface Props {
  story: Story;
}

// 250621 to do merge with page
export default async function StoryDetail({ story }: Props) {
  let mapData: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;

  if (!story) {
    return <p className="text-destructive">Story not found</p>;
  }

  // fetch substories
  const substories = await prisma.subStory.findMany({
    where: { storyId: story.id },
  });

  // fetch mapdata
  try {
    // 240819 This is stupid - change fetchMapData to always expect an integer
    mapData = await fetchMapData(story.assignedToMapID?.toString() || "");

    if (!mapData.map) {
      error = "Map not found";
    }
  } catch (err) {
    error = "Failed to fetch data";
  }

  // 240819 To Do 2: Hook up stories
  // 240820 Unify MapModule logic and StoryModule logic
  return (
    <div>
      <StatusContextProvider>
        <StoryDisplayModule mapData={mapData} story={substories} />
      </StatusContextProvider>
    </div>
  );
}
