import prisma from "@/../prisma/db";
import StatusContextProvider from "@/store/statusContext";
import StoryDisplayModule from "@/components/displays/StoryDisplayModule";
import { fetchMapData } from "@/lib/fetchMapData";

export default async function ViewStory({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const idString = resolvedParams.id;
  let mapData: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;

  const idNum = parseInt(idString);
  if (!idString || isNaN(idNum)) {
    return <div className="text-destructive">Invalid story ID</div>;
  }

  const story = await prisma.story.findUnique({
    where: { id: idNum },
  });

  if (!story) {
    return <div className="text-destructive">Story not found</div>;
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

  return (
    <div className="w-full flex gap-4">
      <div className="col-span-6">
        <StatusContextProvider>
          <StoryDisplayModule mapData={mapData} story={substories} />
        </StatusContextProvider>
      </div>
      <div className="col-span-3 flex flex-col gap-4">
        <h2 className="text-2xl">{story.title}</h2>
        <div id="description">{story.description}</div>
      </div>
    </div>
  );
}
