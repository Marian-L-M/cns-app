import React from "react";
import Link from "next/link";

import prisma from "@/../prisma/db";
import { z } from "zod";

import { fetchMapData } from "@/lib/fetchMapData";
import StoryCanvasModule from "@/components/maps/StoryCanvasModule";
import { StoriesSchema } from "@/ValidationSchemas/stories";
import { Plus } from "lucide-react";

type Story = z.infer<typeof StoriesSchema>;

interface SubstoryListProps {
  substories: Story[];
  id: number;
}

interface Props {
  params: { id: string };
}

// To do 250126 - Switch from story mdoule to story editor module (No infobox)

async function substoryOverviewPage({ params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  let mapData: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;

  const story = await prisma.story.findUnique({
    where: { id: id },
  });
  const substories = await prisma.subStory.findMany({
    where: { storyId: id },
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
    <div className="grid grid-cols-3 gap-4 mx-auto" id="substory-overview">
      <StoryCanvasModule data={mapData} story={substories} />
      <SubstoryOverviewList substories={substories} id={id} />
      <Link
        href={`/stories/${id}/substories/new`}
        className="fixed right-16 bottom-8 flex align-middle justify-center p-2 bg-indigo-950 text-slate-50 rounded-full hover:opacity-75"
      >
        <Plus width={48} height={48} />
      </Link>
    </div>
  );
}

export default substoryOverviewPage;

function SubstoryOverviewList({ substories, id }: SubstoryListProps) {
  return (
    <div className="col-span-1 flex flex-col gap-4" id="substory-overview-list">
      <h1 className="text-2xl font-bold">Substory Overview List</h1>
      <div className="flex flex-col gap-4" id="area-container">
        {substories.map((substory) => (
          <Link
            key={substory.id}
            href={`/stories/${id}/substories/${substory.id}/edit`}
            className="flex gap-2 p-4 bg-slate-800 text-white rounded-lg hover:opacity-90"
          >
            <h6>{substory.title}</h6>
          </Link>
        ))}
      </div>
    </div>
  );
}
