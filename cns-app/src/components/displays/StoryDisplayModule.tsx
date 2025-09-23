"use client";
import { useContext, useEffect, useRef, useState } from "react";

import MapResponsiveCanvas from "@/components/maps/MapResponsiveCanvas";
import { useStoryMaker } from "@/hooks/useStoryMaker";
import { CanvasStyleItem, Map } from "@prisma/client";
import { StatusContext } from "@/store/statusContext";

import InfoboxSheet from "./parts/InfoBoxSheet";
import StoryDrawer from "./parts/StoryDrawer";

interface SubStoryWithStyles {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  nodes: StoryNode[];
  objectTime: number;
  storyId: number;
  canvasStyles?: CanvasStyleItem[];
}

interface StoryModuleProps {
  mapData: {
    map: Map | null; // Allow null
    mapObjects: GlobalObjectType[];
    mapAreas: GlobalAreaType[];
  };
  story: SubStoryWithStyles[]; // Use the new interface
}

export default function StoryDisplayModule({
  mapData, // to do: map data structure is not smart - just work with include on a map object instead of a flattened object
  story, // naming issue story has not been renamed to substory
}: StoryModuleProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const statusCtx = useContext(StatusContext);
  const { map, mapAreas, mapObjects } = mapData;

  const isInitialRender = useRef(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [infoData, setInfoData] = useState();
  const [storyData, setStoryData] = useState();
  const [storyIndex, setStoryIndex] = useState(0);

  // Set Canvas
  const { canvasRef } = useStoryMaker({
    mapData,
    story,
    storyIndex,
    fullscreen,
  });
  // Handle infoBox changes
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (statusCtx.infoBox) {
      if (statusCtx.infoBox.type == "GlobalObjectType") {
        const activeInfoObject = mapObjects.find(
          (object) => object.id == statusCtx.infoBox?.id
        );
        setInfoData(activeInfoObject);
      } else {
        const activeInfoArea = mapAreas.find(
          (area) => area.id == statusCtx.infoBox?.id
        );
        setInfoData(activeInfoArea);
      }
      setSheetOpen(true);
    }
  }, [statusCtx.infoBox]);

  // Handle storyBox changes
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    if (statusCtx.storyBox) {
      story.forEach((storyObject) => {
        storyObject.nodes.forEach((storyNode, index) => {
          if (storyNode.id == statusCtx?.storyBox?.id) {
            setStoryIndex(index);
            setStoryData(storyObject);
            setDrawerOpen(true);
            return;
          }
        });
      });
    }
  }, [statusCtx.storyBox]);
  return (
    <div className="w-full flex flex-col">
      <MapResponsiveCanvas
        map={map}
        canvasRef={canvasRef}
        fullscreen={fullscreen}
        setFullscreen={setFullscreen}
      />
      {/* Infobox Sheet */}
      {infoData && (
        <InfoboxSheet
          sheetOpen={sheetOpen}
          setSheetOpen={setSheetOpen}
          infoData={infoData}
        />
      )}

      {/* Story Drawer */}
      {storyData && (
        <StoryDrawer
          storyData={storyData}
          storyIndex={storyIndex}
          setStoryIndex={setStoryIndex}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        />
      )}
    </div>
  );
}
