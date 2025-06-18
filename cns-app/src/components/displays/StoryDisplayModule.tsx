"use client";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";

import StatusBar from "@/components/ui/maps/statusBar";
import InfoBox from "@/components/ui/maps/infoBox";
import StoryBox from "@/components/ui/maps/storyBox";
import { useStoryMaker } from "@/hooks/useStoryMaker";
import { StatusContext } from "@/store/statusContext";
import { Map } from "@prisma/client";
import MapResponsiveCanvas from "../maps/MapResponsiveCanvas";

interface StoryModuleProps {
  data: {
    map: Map;
    mapObjects: GlobalObjectType[];
    mapAreas: GlobalAreaType[];
  };
  story: story[];
}

export default function StoryDisplayModule({ data, story }: StoryModuleProps) {
  const { canvasRef } = useStoryMaker({ data, story });
  const statusCtx = useContext(StatusContext);
  const { map, mapAreas, mapObjects } = data;

  const activeStatus = statusCtx.statusBar;
  const activeInfo = statusCtx.infoBox;
  const activeStory = statusCtx.storyBox;

  let infoData;
  if (activeInfo?.type == "GlobalObjectType") {
    infoData = mapObjects;
  } else {
    infoData = mapAreas;
  }

  // 240811 TODO: Add story via state
  return (
    <div className="w-full flex flex-col">
      <div className="w-full text-center mb-2">
        {activeStatus && (
          <StatusBar
            id={activeStatus.id}
            title={activeStatus.title}
            type={activeStatus.type}
          />
        )}
      </div>
      <div className="w-full">
        <MapResponsiveCanvas map={map} canvasRef={canvasRef} />
        {/* <div className="flex flex-col gap-2" id="sidebar">
          <div
            className="border-2 border-indigo-500 rounded-md p-1"
            id="infobox"
          >
            {activeInfo && (
              <InfoBox
                id={activeInfo.id}
                title={activeInfo.title}
                type={activeInfo.type}
                infoData={infoData}
              />
            )}
          </div>
          {activeStory && (
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
          )}
        </div> */}
      </div>
    </div>
  );
}
