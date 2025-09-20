import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { z } from "zod";

import { fetchMapData } from "@/lib/fetchMapData";
import prisma from "@/../prisma/db";
import { StoriesSchema } from "@/ValidationSchemas/stories";
import StoryCanvasModule from "@/components/maps/StoryCanvasModule";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import StatusContextProvider from "@/store/statusContext";
import StoryDisplayModule from "@/components/displays/StoryDisplayModule";

type Story = z.infer<typeof StoriesSchema>;

interface SubstoryListProps {
  substories: Story[];
  id: number;
}

interface Props {
  params: { id: string };
}

// To do 250126 - Switch from story mdoule to story editor module (No infobox)

export default async function substoryOverviewPage({ params }: Props) {
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
    include: {
      userStories: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
      assignedToMap: true,
      subStories: true,
    },
  });

  // Validation
  if (!story) {
    return <div className="text-destructive">No story found</div>;
  }

  if (!story.subStories) {
    return <div className="text-destructive">No substories found</div>;
  }
  // Check if current user has permission to edit
  const session = await requireOwnerOrAdmin({ userStories: story.userStories });

  // fetch mapdata with better error handling
  try {
    if (story.assignedToMapID) {
      const fetchedMapData = await fetchMapData(
        story.assignedToMapID.toString()
      );

      // Ensure we have a valid structure
      if (fetchedMapData && typeof fetchedMapData === "object") {
        mapData = {
          map: fetchedMapData.map || null,
          mapAreas: Array.isArray(fetchedMapData.mapAreas)
            ? fetchedMapData.mapAreas
            : [],
          mapObjects: Array.isArray(fetchedMapData.mapObjects)
            ? fetchedMapData.mapObjects
            : [],
        };

        if (!mapData.map) {
          error = "Map not found";
        }
      } else {
        error = "Invalid map data format";
      }
    } else {
      error = "No map assigned to this story";
    }
  } catch (err) {
    console.error("Error fetching map data:", err);
    error = "Failed to fetch data";
    // Ensure mapData maintains proper structure even on error
    mapData = { map: null, mapAreas: [], mapObjects: [] };
  }

  return (
    <div className="flex gap-4">
      <div className="w-4/5">
        <StatusContextProvider>
          <StoryDisplayModule mapData={mapData} story={story.subStories} />
        </StatusContextProvider>
      </div>
      <div className="w-1/5">
        <div
          className="col-span-1 flex flex-col gap-4"
          id="substory-overview-list"
        >
          <h1 className="text-2xl font-bold">Substory Overview List</h1>
          <div className="flex flex-col gap-4" id="area-container">
            {story.subStories.map((substory) => (
              <Link
                key={substory.id}
                href={`/editor/stories/${id}/substories/${substory.id}`}
                className="flex gap-2 p-4 bg-slate-800 text-white rounded-lg hover:opacity-90"
              >
                <h6>{substory.title}</h6>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Link
        href={`/editor/stories/${id}/substories/create`}
        className="fixed right-16 bottom-8 flex align-middle justify-center p-2 bg-indigo-950 text-slate-50 rounded-full hover:opacity-75"
      >
        <Plus width={48} height={48} />
      </Link>
    </div>
  );
}
