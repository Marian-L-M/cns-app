"use client";
import { useStoryMaker } from "@/hooks/useStoryMaker";
import Image from "next/image";
import { FC, useContext } from "react";
import { StatusContext } from "@/store/statusContext";
import StatusBar from "../ui/maps/statusBar";
import InfoBox from "../ui/maps/infoBox";
import StoryBox from "../ui/maps/storyBox";

//240822 Unify story module with map module
const StoryModule: FC<StoryModuleProps> = ({ data, story }) => {
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

  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
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
      <div className="w-full grid grid-cols-3 gap-4 max-w-screen-2xl mx-auto">
        <div className="relative max-w-screen-lg col-span-2 " id="map-base">
          <canvas
            // onMouseDown={onMouseDown}
            // handlerFunction
            ref={canvasRef}
            width={windowSize > 1024 ? 1024 : windowSize}
            height={windowSize > 1024 ? 1024 : windowSize} // Width for square maps
            className="border border-grey rounded-md relative z-10 w-full"
          />
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
        </div>
      </div>
    </div>
  );
};

export default StoryModule;
