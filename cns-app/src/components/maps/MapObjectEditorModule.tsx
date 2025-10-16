"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMapObjectEditor } from "@/hooks/useMapEditor";
import { CanvasStyleItem, MapAreaType, MapObjectType } from "@prisma/client";

import GlobalObjectForm from "../forms/ObjectForm";
import { JsonValue } from "@prisma/client/runtime/library";
import MapResponsiveCanvas from "./MapResponsiveCanvas";
import { useWindowSize } from "@/hooks/useWindow";

interface Props {
  map: MapType;
  globalObject?: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    iconUrl: string;
    bannerUrl: string;
    thumbUrl: string;
    objectTime: number;
    x: number;
    y: number;
    mapId: number;
    // wikiId: number;
    wikiId: number | null;
    type: MapObjectType;
    canvasStyles: CanvasStyleItem[];
  };
  globalArea?:
    | {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        bannerUrl: string;
        imageUrl: string;
        nodes?: JsonValue;
        objectTime: number;
        mapId: number;
        wikiId: number | null;
        type: MapAreaType;
        canvasStyles: CanvasStyleItem[];
      }
    | undefined;
  editorMode?: string;
}

export default function MapObjectEditorModule({ map, globalObject }: Props) {
  //250111 TODO - Editormode should be state or context?
  const { canvasRef } = useMapObjectEditor({ globalObject });
  const containerRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState<number>(896);
  const [fullscreen, setFullscreen] = useState(false); // Fullscreen disabled
  const windowSize = useWindowSize({
    aspectRatio: map?.canvasAspectRatio || 1,
    padding: 40,
    border: 1,
    fullscreen: fullscreen,
    availabeWidth: availableWidth,
  });
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current?.offsetWidth) {
        setAvailableWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <div className="w-full" id="map-editor-module">
      <div className="grid grid-cols-12 gap-4 max-w-screen-2xl mx-auto relative">
        <div
          ref={containerRef}
          className="relative z-10 col-span-7"
          id="map-base"
        >
          <canvas
            ref={canvasRef}
            width={windowSize.width}
            height={windowSize.height}
            className="absolute top-0 left-0 border border-grey z-10 w-full"
          />
          {map?.mapUrl && (
            <Image
              priority={true}
              className="relative  z-1 pointer-events-none "
              src={map.mapUrl}
              alt={map.title}
              style={{ objectFit: "contain" }}
              width={windowSize.width}
              height={windowSize.height}
            />
          )}
        </div>
        <div className="col-span-5">
          <GlobalObjectForm map={map} globalObject={globalObject} />
        </div>
      </div>
    </div>
  );
}
