"use client";
import Image from "next/image";
import React from "react";

import { useStoryMaker } from "@/hooks/useStoryMaker";

export default function StoryCanvasModule({ data, story }: StoryModuleProps) {
  const { canvasRef } = useStoryMaker({ data, story });
  const { map } = data;

  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }

  return (
    <div className="col-span-2 w-full">
      <div className="relative max-w-screen-lg" id="map-base">
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
    </div>
  );
}
