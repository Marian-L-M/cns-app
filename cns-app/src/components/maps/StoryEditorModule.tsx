// import StoryDetail from "../StoryDetail";
import StatusContextProvider from "@/store/statusContext";
import StoryModule from "@/components/maps/StoryModule";
import { fetchMapData } from "@/lib/fetchMapData";
import { fetchStoryData } from "@/lib/fetchStoryData";

// const StoryForm = dynamic(() => import("@/components/forms/StoryForm"), {
//   ssr: false,
// });
import { Entry } from "@prisma/client";
import { Noto_Sans_Lepcha } from "next/font/google";

interface EntryProps {
  entry: Entry;
}

async function StoryEditorModule({ entry }: EntryProps) {
  let mapData: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;
  // fetch map
  try {
    // 240819 This is stupid - change fetchMapData to always expect an integer
    // mapData = await fetchMapData(story.assignedToMapID?.toString() || "");
    mapData = await fetchMapData("3");

    if (!mapData.map) {
      error = "Map not found";
    }
  } catch (err) {
    console.log("mapData");
    console.log(mapData);
    error = "Failed to fetch data";
  }

  // fetch story
  let storyData: story[] = [];

  try {
    const fetchedStoryData = await fetchStoryData(entry.id);

    if (!fetchedStoryData.story || fetchedStoryData.story.length === 0) {
      throw new Error("No story found");
    } else {
      storyData = fetchedStoryData.story;
    }
  } catch (err) {
    error = (err as Error).message || "Failed to fetch story";
  }

  return (
    <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative">
      {/* <div className="col-span-4" id="map-base">
        <StoryDetail story={story} />
      </div>
      <div className="col-span-2" id="form-base">
        <StoryForm story={story} />
      </div> */}
      <div className="col-span-4" id="map-base">
        <StatusContextProvider>
          <StoryModule data={mapData} story={storyData} />
        </StatusContextProvider>
      </div>
    </div>
  );
}

export default StoryEditorModule;
