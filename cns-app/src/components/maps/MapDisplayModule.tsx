"use client";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";

import StatusBar from "@/components/ui/maps/statusBar";
import { useMapMaker } from "@/hooks/useMapMaker";
import { StatusContext } from "@/store/statusContext";

export default function MapDisplayModule({ data }: MapModuleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    width: 1024,
    height: 1024,
  });

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

  // Handle map size
  useEffect(() => {
    // Function to update the container size
    const updateSize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        // Set the height equal to width for a square canvas, or adjust as needed
        setContainerSize({
          width: Math.min(width, 1024),
          height: Math.min(width, 1024),
        });
      }
    };

    // Initial size update
    updateSize();

    // Add resize event listener
    window.addEventListener("resize", updateSize);

    // Clean up
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // 240925 Make map resizable
  // 250517 - Marked for deletion - replace with MapDisplayModule
  // Infobox to sidebar
  return (
    <div className="w-full flex flex-col col-span-6">
      <div>
        <h1>Width: {containerSize.width}</h1>
        <h1>Height:{containerSize.height}</h1>
      </div>
      <div ref={containerRef} className="relative w-full" id="map-base">
        {/* Status bar to sonner or drawer */}
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
          ref={canvasRef}
          width={containerSize.width}
          height={containerSize.height}
          className="border border-grey relative z-10 w-full"
        />
        <Image
          priority={true}
          className="absolute top-0 left-0 z-1 pointer-events-none"
          src={map?.mapUrl}
          alt="Map of Kamolin"
          width={containerSize.width}
          height={containerSize.height}
        />
      </div>
      {/* <div className="flex-1" id="infobox">
        {activeInfo && (
          <InfoBox
            id={activeInfo.id}
            title={activeInfo.title}
            type={activeInfo.type}
            infoData={infoData}
          />
        )}
      </div> */}
    </div>
  );
}
