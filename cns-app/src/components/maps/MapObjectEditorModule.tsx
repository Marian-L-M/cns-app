"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMapObjectEditor } from "@/hooks/useMapEditor";
import { CanvasStyleItem, GlobalObject } from "@prisma/client";

import GlobalObjectForm from "../forms/ObjectForm";

interface Props {
  map: MapType;
  globalObject?: GlobalObject;
  globalArea?:
    | {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        imageUrl: string;
        nodes?: areaNode[];
        objectTime: number;
        mapId: number;
        wikiId: number;
        type: "GEOGRAPHY" | "ABSTRACT" | "INTERACTIVE";
        canvasStyles: CanvasStyleItem[];
      }
    | undefined;
  editorMode?: string;
}

export default function MapObjectEditorModule({ map, globalObject }: Props) {
  //250111 TODO - Editormode should be state or context?
  const { canvasRef } = useMapObjectEditor({ globalObject });
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    width: 1024,
    height: 1024,
  });

  // To do -> Turn into custom hook
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

  return (
    <div className="w-full" id="map-editor-module">
      <div className="grid grid-cols-6 gap-4 max-w-screen-2xl mx-auto relative">
        <div
          className="relative z-10 max-w-screen-lg col-span-4 bg-black"
          id="map-base"
        >
          <canvas
            ref={canvasRef}
            width={containerSize.width}
            height={containerSize.height}
            className="border border-grey relative z-10 w-full"
          />
          {map?.mapUrl && (
            <Image
              priority={true}
              className="absolute top-0 left-0 z-1 pointer-events-none opacity-70"
              src={map.mapUrl}
              alt="Map of Kamolin"
              width={containerSize.width}
              height={containerSize.height}
            />
          )}
        </div>
        <GlobalObjectForm map={map} globalObject={globalObject} />
      </div>
    </div>
  );
}
