"use client";
import { useMasterMapMaker } from "@/hooks/useMasterMapMaker";
import Image from "next/image";
import { FC, useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";
import { CursorContext } from "@/store/cursorContext";
import { Map, MapHierarchyMaster } from "@prisma/client";

interface MapWithRectangularArea extends Map, PointRectangularArea {}
interface ParentMap extends Map, MapHierarchyMaster {}

interface MasterMapProps {
  mapParent: Map;
}
interface MasterMapProps {
  masterMap: {
    parentMap: ParentMap;
    childMaps: MapWithRectangularArea[]; // To do: Remove MapWithRectangularArea logic -> now handled by maphierarchy child
  };
}

const MasterMapModule: FC<MasterMapProps> = ({ masterMap }) => {
  const { parentMap, childMaps } = masterMap;
  const { canvasRef } = useMasterMapMaker({ childMaps });
  const tooltipCtx = useContext(CursorContext);

  let windowSize: number = 1024;
  if (typeof window !== "undefined") {
    windowSize = window.innerWidth;
  }

  // 240925 Make map resizable
  return (
    <div className="w-full col-span-4 relative">
      <div className="relative max-w-screen-lg" id="map-base">
        <canvas
          ref={canvasRef}
          width={windowSize > 1024 ? 1024 : windowSize}
          height={windowSize > 1024 ? 1024 : windowSize}
          className="border border-grey relative z-10 w-full"
        />
        <Image
          priority={true}
          className="absolute top-0 left-0 z-1 pointer-events-none"
          src={`/${parentMap.mapUrl || "maps/placeholder.jpg"}`}
          alt={`${parentMap.title} - map`}
          width="1024"
          height="1024"
        />
        <MouseToolTip cursorContext={tooltipCtx} />
      </div>
    </div>
  );
};

export default MasterMapModule;

// Mouse tracker
// https://yoavik.com/snippets/mouse-tracker

const MouseToolTip = ({ cursorContext }: any) => {
  if (!cursorContext.mouseTooltip) return null;

  return (
    <MouseTracker offset={{ x: 20, y: 20 }}>
      <div className="bg-white border border-gray-300 rounded p-2 shadow-md flex flex-col align-center gap-1">
        <Image
          src={`/${cursorContext.mouseTooltip.imageUrl}`}
          alt="dummy"
          width={100}
          height={100}
        />
        <span className="font-bold text-center">
          {cursorContext.mouseTooltip.title}
        </span>
      </div>
    </MouseTracker>
  );
};

const MouseTracker = ({ children, offset = { x: 0, y: 0 } }: any) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted on client
    setIsMounted(true);

    // Handler for mouse movement
    function handleMouseMove(e: MouseEvent) {
      setPosition({
        x: e.clientX + offset.x,
        y: e.clientY + offset.y,
      });
      setIsVisible(true);
    }

    // Add event listener
    document.addEventListener("mousemove", handleMouseMove);

    // Clean up event listener on unmount
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [offset.x, offset.y]);

  // Do not render anything during SSR
  if (!isMounted) {
    return null;
  }

  // Style the tracker div
  // Todo: 250318 Fix style
  const trackerStyle = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    visibility: isVisible ? "visible" : "hidden",
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "none",
    zIndex: 9999,
  };

  return createPortal(
    <div style={trackerStyle}>{children}</div>,
    document.body
  );
};
