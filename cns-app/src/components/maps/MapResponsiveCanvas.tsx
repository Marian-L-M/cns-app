"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Map } from "@prisma/client";
interface Props {
  map: Map;
  canvasRef: any;
}

export default function MapResponsiveCanvas({ map, canvasRef }: Props) {
  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    width: 1024,
    height: 1024,
  });

  // Handle map size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();

        // To do: handle rectangular maps
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
    <div className="relative w-full max-w-5xl" id="map-base">
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
          alt={map.title}
          width={containerSize.width}
          height={containerSize.height}
        />
      )}
    </div>
  );
}
