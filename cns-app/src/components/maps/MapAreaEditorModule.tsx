"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMapAreaEditor } from "@/hooks/useMapEditor";
import { CanvasStyleItem, GlobalObject, MapAreaType } from "@prisma/client";

import GlobalAreaForm from "../forms/AreaForm";
import { JsonValue } from "@prisma/client/runtime/library";
import { useWindowSize } from "@/hooks/useWindow";

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
        bannerUrl: string;
        imageUrl: string;
        // nodes?: areaNode[];
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

export default function MapAreaEditorModule({ map, globalArea }: Props) {
  //250111 TODO - Editormode should be state or context?
  const { canvasRef } = useMapAreaEditor({ globalArea });
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
      <div className="flex justify-between gap-4 mx-auto relative">
        <div
          ref={containerRef}
          className="relative z-10 w-fit max-w-full max-h-full"
          id="map-base"
        >
          <canvas
            ref={canvasRef}
            width={windowSize.width}
            height={windowSize.height}
            className="border border-grey relative z-10 w-full"
          />
          {map?.mapUrl && (
            <Image
              priority={true}
              className="absolute top-0 left-0 z-1 pointer-events-none "
              src={map.mapUrl}
              alt={map.title}
              style={{ objectFit: "contain" }}
              // fill={true}
              width={windowSize.width}
              height={windowSize.height}
            />
          )}
        </div>
        <div className="w-5/12">
          <GlobalAreaForm map={map} globalArea={globalArea} />
        </div>
      </div>
    </div>
  );
}
