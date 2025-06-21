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

interface StoryModuleProps {
  mapData: {
    map: Map;
    mapObjects: GlobalObjectType[];
    mapAreas: GlobalAreaType[];
  };
  story: story[];
}

// 250619 To do: Renaming data -> mapData for more clarity
export default function StoryDisplayModule({
  mapData,
  story,
}: StoryModuleProps) {
  const { canvasRef } = useStoryMaker({ mapData, story });
  const statusCtx = useContext(StatusContext);
  const { map, mapAreas, mapObjects } = mapData;

  const [sheetOpen, setSheetOpen] = useState(false);
  const isInitialRender = useRef(true);

  const activeStory = statusCtx.storyBox;

  const [infoData, setInfoData] = useState();

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

  // 250619: Handle story via drawer + ability to move
  return (
    <div className="w-full flex flex-col">
      <MapResponsiveCanvas map={map} canvasRef={canvasRef} />
      <div className="w-full">
        <div className="flex flex-col gap-2" id="sidebar">
          {activeStory && (
            <div
              className="border-2 border-sky-500 rounded-md p-1"
              id="storybox"
            >
              <StoryBox
                id={activeStory.id}
                title={activeStory.title}
                type={activeStory.type}
                description={activeStory.description}
              />
            </div>
          )}
        </div>
      </div>
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
    </div>
  );
}
