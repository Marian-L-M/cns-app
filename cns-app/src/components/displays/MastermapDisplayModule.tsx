"use client";
import Image from "next/image";
import { useEffect, useState, useContext, useRef } from "react";
import { createPortal } from "react-dom";

import { useMasterMapMaker } from "@/hooks/useMasterMapMaker";
import { CanvasStyleItem, Map } from "@prisma/client";
import { CursorContext } from "@/store/cursorContext";
import { useWindowSize } from "@/hooks/useWindow";
import { Switch } from "../ui/switch";

interface ChildMap {
  canvasAspectRatio: number;
  canvasStyles: CanvasStyleItem[];
  category: string;
  createdAt: Date;
  description: string;
  featured: boolean;
  hierarchyChildId: number;
  hierarchyParentId: number;
  id: number;
  imageUrl: string;
  mapHeight: number;
  mapTime: number;
  mapUrl: string;
  mapWidth: number;
  slug: string | null;
  tags: string[];
  title: string;
  updatedAt: Date;
  wx: number;
  wy: number;
  x: number;
  y: number;
}

type ParentMap = Map;

interface MasterMapData {
  parentMap: ParentMap;
  childMaps: ChildMap[];
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  bannerUrl: string | null;
  parentMapId: number;
}

interface MasterMapProps {
  masterMap: MasterMapData | null;
}

export default function MastermapDisplayModule({ masterMap }: MasterMapProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const parentMap = masterMap?.parentMap;
  const childMaps = masterMap?.childMaps || [];
  const { canvasRef } = useMasterMapMaker({ childMaps, fullscreen });
  const tooltipCtx = useContext(CursorContext);

  const containerRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState<number>(896);

  const windowSize = useWindowSize({
    aspectRatio: parentMap?.canvasAspectRatio || 1,
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

  // 240925 To do Issue - Child maps do not render initially
  // Didn't update usermastermapmaker yet
  return (
    <div
      className={` w-full flex flex-col gap-2 ${
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
      <div
        className="relative z-10 w-fit max-w-full max-h-full"
        ref={containerRef}
        id="map-base"
      >
        <canvas
          ref={canvasRef}
          width={windowSize.width}
          height={windowSize.height}
          className="border border-grey relative z-10 w-full"
        />
        <Image
          priority={true}
          className="absolute top-0 left-0 z-1 pointer-events-none"
          src={parentMap?.mapUrl || "placeholder.png"}
          alt={`${parentMap?.title} - map`}
          style={{ objectFit: "contain" }}
          fill={true}
          // width="1024"
          // height="1024"
        />
        <MouseToolTip cursorContext={tooltipCtx} />
      </div>
      {/* disable fullscreen */}
      {fullscreen && (
        <div
          className="absolute z-0 top-0 left-0 w-full h-full"
          id="disable-fullscreen"
          onClick={() => {
            setFullscreen(false);
          }}
        ></div>
      )}
    </div>
  );
}

// Mouse tracker
// https://yoavik.com/snippets/mouse-tracker

const MouseToolTip = ({ cursorContext }: any) => {
  if (!cursorContext.mouseTooltip) return null;

  return (
    <MouseTracker offset={{ x: 20, y: 20 }}>
      <div className="bg-white border border-gray-300 rounded p-2 shadow-md flex flex-col align-center gap-1">
        <Image
          src={`${cursorContext.mouseTooltip.imageUrl}`}
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
  const trackerStyle: React.CSSProperties = {
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
