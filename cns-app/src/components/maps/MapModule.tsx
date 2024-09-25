"use client";
import { useMapMaker } from "@/hooks/useMapMaker";
import Image from "next/image";
import { FC, useContext } from "react";
import { StatusContext } from "@/store/statusContext";
import StatusBar from "../ui/maps/statusBar";
import InfoBox from "../ui/maps/infoBox";

const MapModule: FC<MapModuleProps> = ({ data }) => {
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
    <div className="w-full ">
      <div className="w-full text-center mb-2">
        {activeStatus && (
          <StatusBar
            id={activeStatus.id}
            title={activeStatus.title}
            type={activeStatus.type}
          />
        )}
      </div>
      <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto">
        <div className="relative max-w-screen-lg col-span-4 " id="map-base">
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
};

export default MapModule;
