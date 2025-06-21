"use client";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";

import StoryBox from "@/components/ui/maps/storyBox";
import MapResponsiveCanvas from "@/components/maps/MapResponsiveCanvas";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import InfoBox from "@/components/wiki/InfoBox";
import { useStoryMaker } from "@/hooks/useStoryMaker";
import { Map } from "@prisma/client";
import { StatusContext } from "@/store/statusContext";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

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

  function changeStoryNodeIndex(increment: number) {
    const storyLength = storyData?.nodes?.length;
    if (storyLength > storyIndex + increment && storyIndex + increment >= 0) {
      setStoryIndex(storyIndex + increment);
    }
  }

  // 250619: Handle story via drawer + ability to move
  return (
    <div className="w-full flex flex-col">
      <MapResponsiveCanvas map={map} canvasRef={canvasRef} />
      {/* Infobox Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{infoData?.title}</SheetTitle>
            <SheetDescription>{infoData?.description}</SheetDescription>
          </SheetHeader>
          {/* 250620 - Infobox logic bugging */}
          {infoData?.wiki?.infobox && (
            <InfoBox infoBox={infoData?.wiki?.infobox} />
          )}
          <SheetFooter>
            <Link href={"/"}>Wiki Link</Link>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      {/* Story Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{storyData?.title}</DrawerTitle>
            <DrawerDescription>{storyData?.description}</DrawerDescription>
          </DrawerHeader>
          <div className="flex flex-col gap-4 py-4 px-8">
            <div className="flex gap-4" id="story-progress">
              {storyData?.nodes?.map((node) => {
                <div>Node</div>;
              })}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => changeStoryNodeIndex(-1)}
                id="prev-story-node"
              >
                Previous
              </Button>
              <div id="story-node-text">
                <h4>{storyData?.nodes[storyIndex].name}</h4>
                <p>{storyData?.nodes[storyIndex].description}</p>
              </div>
              <Button
                onClick={() => changeStoryNodeIndex(1)}
                id="next-story-node"
              >
                Next
              </Button>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Hide</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
