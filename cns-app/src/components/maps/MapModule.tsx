"use client";
import Image from "next/image";
import { useContext } from "react";

import StatusBar from "@/components/ui/maps/statusBar";
import InfoBox from "@/components/ui/maps/infoBox";
import { useMapMaker } from "@/hooks/useMapMaker";
import { StatusContext } from "@/store/statusContext";

export default function MapModule({ data }: MapModuleProps) {
  const { canvasRef } = useMapMaker({ data });
  const statusBarCtx = useContext(StatusContext);
  const { map, mapAreas, mapObjects } = data;

  const activeStatus = statusBarCtx.statusBar;
  const activeInfo = statusBarCtx.infoBox;

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

  // 240925 Make map resizable
  return (
    <div className="w-full">
      <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative">
        <div className="relative max-w-screen-lg col-span-4 " id="map-base">
          <div className="w-full mb-2 absolute z-10 top-0 left-0 ">
            {activeStatus && (
              <StatusBar
                id={activeStatus.id}
                title={activeStatus.title}
                type={activeStatus.type}
              />
            )}
          </div>
          <canvas
            // onMouseDown={onMouseDown}
            // handlerFunction
            ref={canvasRef}
            width={windowSize > 1024 ? 1024 : windowSize}
            height={windowSize > 1024 ? 1024 : windowSize} // Width for square maps
            className="border border-grey relative z-10 w-full"
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
        <div className="col-span-2" id="infobox">
          {activeInfo && (
            <InfoBox
              id={activeInfo.id}
              title={activeInfo.title}
              type={activeInfo.type}
              infoData={infoData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
