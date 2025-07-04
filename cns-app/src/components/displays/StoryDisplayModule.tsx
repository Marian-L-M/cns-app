"use client";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";

import MapResponsiveCanvas from "@/components/maps/MapResponsiveCanvas";
import { useStoryMaker } from "@/hooks/useStoryMaker";
import { Map } from "@prisma/client";
import { StatusContext } from "@/store/statusContext";

import InfoboxSheet from "./parts/InfoboxSheet";
import StoryDrawer from "./parts/StoryDrawer";

interface StoryModuleProps {
  mapData: {
    map: Map;
    mapObjects: GlobalObjectType[];
    mapAreas: GlobalAreaType[];
  };
  story: story[];
}

export default function StoryDisplayModule({
  mapData,
  story,
}: StoryModuleProps) {
  const { canvasRef } = useStoryMaker({ mapData, story });
  const statusCtx = useContext(StatusContext);
  const { map, mapAreas, mapObjects } = mapData;

  const isInitialRender = useRef(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [infoData, setInfoData] = useState();
  const [storyData, setStoryData] = useState();
  const [storyIndex, setStoryIndex] = useState(0);

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
      // console.log(statusCtx.storyBox);
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
      <MapResponsiveCanvas map={map} canvasRef={canvasRef} />
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
