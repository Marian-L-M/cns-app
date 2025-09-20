"use client";
import { useContext, useEffect, useRef, useState } from "react";

import { useMapMaker } from "@/hooks/useMapMaker";
import { StatusContext } from "@/store/statusContext";
import MapResponsiveCanvas from "@/components/maps/MapResponsiveCanvas";
import InfoboxSheet from "./parts/InfoBoxSheet";

export default function MapDisplayModule({ data, settings }: MapModuleProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const { canvasRef } = useMapMaker({ data, settings, fullscreen });
  const statusCtx = useContext(StatusContext);
  const { map, mapAreas, mapObjects } = data;

  const isInitialRender = useRef(true);
  const [sheetOpen, setSheetOpen] = useState(false);
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
  }, [statusCtx.infoBox, mapAreas, mapObjects]);

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
    </div>
  );
}
