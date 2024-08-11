"use client";
import { useMapMaker } from "@/hooks/useMapMaker";
import Image from "next/image";
import { FC } from "react";

const MapModule: FC<MapModuleProps> = ({ data }) => {
  const { canvasRef } = useMapMaker({ data });
  const { map } = data;

  // 240811 TODO: Add story via state
  return (
    <div className="w-scren h-screen bg-white justify-center items-center">
      <div className="relative" id="map-base">
        <canvas
          // onMouseDown={onMouseDown}
          ref={canvasRef}
          width={window.innerWidth > 1024 ? 1024 : window.innerWidth}
          height={window.innerWidth > 1024 ? 1024 : window.innerWidth} // Width for square maps
          className="border border-grey rounded-md relative z-10"
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
    </div>
  );
};

export default MapModule;
