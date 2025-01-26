import React from "react";
import StatusContextProvider from "@/store/statusContext";
import StoryModule from "@/components/maps/StoryModule";
import { fetchMapData } from "@/lib/fetchMapData";
import prisma from "../../../../../prisma/db";

interface Props {
  params: { id: string };
}

async function substoryOverviewPage({ params }: Props) {
  let mapData: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;

  const story = await prisma.entry.findUnique({
    where: { id: parseInt(params.id) },
  });
  const substories = await prisma.story.findMany({
    where: { entryId: parseInt(params.id) },
  });

  if (!story) {
    return <div className="text-destructive">No story found</div>;
  }
  if (!substories) {
    return <div className="text-destructive">No substories found</div>;
  }
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
    <StatusContextProvider>
      <div id="substory-overview">
        {story && <StoryModule data={mapData} story={substories} />}
      </div>
    </StatusContextProvider>
  );
}

export default substoryOverviewPage;
