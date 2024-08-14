"use client";
import { useMapMaker } from "@/hooks/useMapMaker";
import Image from "next/image";
import { FC, useContext } from "react";
import { StatusContext } from "@/store/statusContext";
import StatusBar from "../ui/maps/statusBar";

const MapModule: FC<MapModuleProps> = ({ data }) => {
  const { canvasRef } = useMapMaker({ data });
  const statusBarCtx = useContext(StatusContext);
  const { map } = data;

  const activeStatus = statusBarCtx.statusBar;
  // 240811 TODO: Add story via state
  return (
    <div className="w-screen h-screen bg-white justify-center items-center">
      <div className="w-full text-center mb-2">
        {activeStatus && (
          <StatusBar
            id={activeStatus.id}
            title={activeStatus.title}
            type={activeStatus.type}
          />
        )}
      </div>
      <div className="grid grid-cols-3 gap-4 max-w-screen-2xl mx-auto">
        <div className="relative max-w-screen-lg col-span-2 " id="map-base">
          <canvas
            // onMouseDown={onMouseDown}
            // handlerFunction
            ref={canvasRef}
            width={window.innerWidth > 1024 ? 1024 : window.innerWidth}
            height={window.innerWidth > 1024 ? 1024 : window.innerWidth} // Width for square maps
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
        <div id="infobox">I am the Infobox</div>
      </div>
    </div>
  );
};

export default MapModule;
