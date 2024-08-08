"use client";
import { useMapMaker } from "@/hooks/useMapMaker";
import Image from "next/image";
import { FC } from "react";

const MapModule: FC<MapModuleProps> = ({ data }) => {
  const { canvasRef } = useMapMaker({ data });

  return (
    <div className="w-scren h-screen bg-white justify-center items-center">
      <div className="relative" id="map-base">
        <canvas
          // onMouseDown={onMouseDown}
          ref={canvasRef}
          width={1024}
          height={1024}
          className="border border-grey rounded-md relative z-10"
        />
        <Image
          priority={true}
          className="absolute top-0 left-0 z-1 pointer-events-none"
          src={"/maps/kamolin-map.jpg"}
          alt="Map of Kamolin"
          width="1024"
          height="1024"
        />
      </div>
    </div>
  );
};

export default MapModule;
