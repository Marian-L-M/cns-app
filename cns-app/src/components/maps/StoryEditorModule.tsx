// "Canvas logic needs to go into another separate client component";
import Image from "next/image";
import InfoBox from "../ui/maps/infoBox";
import StatusContextProvider from "@/store/statusContext";
import StoryModule from "@/components/maps/StoryModule";
import { fetchMapData } from "@/lib/fetchMapData";
import { fetchStoryData } from "@/lib/fetchStoryData";
import { Entry } from "@prisma/client";
import { useStoryMaker } from "@/hooks/useStoryMaker";

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

  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }

  const { map, mapAreas, mapObjects } = mapData;
  //   const { canvasRef } = useStoryMaker({ mapData, storyData });

  return (
    <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative">
      {/* 250123: Issue nested grids*/}
      {/* <div className="col-span-4" id="map-base">
        <StoryDetail story={story} />
      </div>
      <div className="col-span-2" id="form-base">
        <StoryForm story={story} />
      </div> */}
      <div className="col-span-4" id="map-base">
        {/* <StatusContextProvider>
          <StoryModule data={mapData} story={storyData} />
        </StatusContextProvider> */}
        <div className="w-full grid grid-cols-3 gap-4 max-w-screen-2xl mx-auto">
          <div className="relative max-w-screen-lg col-span-2 " id="map-base">
            {/* <canvas
              // onMouseDown={onMouseDown}
              // handlerFunction
              ref={canvasRef}
              width={windowSize > 1024 ? 1024 : windowSize}
              height={windowSize > 1024 ? 1024 : windowSize} // Width for square maps
              className="border border-grey rounded-md relative z-10 w-full"
            /> */}
            <Image
              // 240808 TODO: get placeholder image if map is not found
              priority={true}
              className="absolute top-0 left-0 z-1 pointer-events-none"
              src={`/${map?.mapUrl || "maps/placeholder.jpg"}`}
              alt="Map of Kamolin"
              width="1024"
              height="1024"
            />
          </div>
          <div className="flex flex-col gap-2" id="sidebar">
            {/* {activeStory && (
              <div
                className="border-2 border-sky-500 rounded-md p-1"
                id="storybox"
              >
                <StoryBox
                  id={activeStory.id}
                  title={activeStory.title}
                  type={activeStory.type}
                  description={activeStory.description}
                />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryEditorModule;
