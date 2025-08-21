"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Map } from "@prisma/client";
import { useWindowSize } from "@/hooks/useWindow";
import { Switch } from "../ui/switch";

interface Props {
  map: Map;
  canvasRef: any;
  fullscreen: boolean;
  setFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
}

// 250820 - Issue: Object drawing doesnt rerender on fullscreen toggle (Objects are offset)
export default function MapResponsiveCanvas({
  map,
  canvasRef,
  fullscreen,
  setFullscreen,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState<number>(896);
  // const [fullscreen, setFullscreen] = useState(false);

  const windowSize = useWindowSize({
    aspectRatio: map.canvasAspectRatio,
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
    <div
      ref={containerRef}
      className={` flex flex-col gap-2 ${
        fullscreen
          ? "fixed top-0 left-0 w-full h-full z-20 bg-black bg-opacity-80 p-10 flex flex-row items-center justify-center"
          : ""
      }`}
      id="item-container"
    >
      <div
        id="fullscreen-toogle"
        className={`flex gap-2 ${
          fullscreen
            ? "absolute top-2 right-2 text-white"
            : "text-black relative z-10"
        }`}
      >
        <Switch
          id="fullscreen-mode"
          checked={fullscreen ? true : false}
          onCheckedChange={() => {
            setFullscreen(!fullscreen);
          }}
        />
        {fullscreen ? "Exit fullscreen" : "Fullscreen"}
      </div>
      <div className="relative z-10 w-fit max-w-full max-h-full" id="map-base">
        <canvas
          ref={canvasRef}
          width={windowSize.width}
          height={windowSize.height}
          className="border border-grey relative z-10"
        />
        {map?.mapUrl && (
          <Image
            priority={true}
            className="absolute top-0 left-0 z-1 pointer-events-none "
            src={map.mapUrl}
            alt={map.title}
            style={{ objectFit: "contain" }}
            fill={true}
            // width={windowSize.width}
            // height={windowSize.height}
          />
        )}
      </div>
      {/* disable fullscreen */}
      {fullscreen && (
        <div
          className="absolute z-0 top-0 left-0 w-full h-full"
          onClick={() => {
            setFullscreen(false);
          }}
        ></div>
      )}
    </div>
  );
}
