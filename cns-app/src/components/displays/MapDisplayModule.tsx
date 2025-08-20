"use client";
import { useContext, useEffect, useRef, useState } from "react";

import { useMapMaker } from "@/hooks/useMapMaker";
import StatusContextProvider, { StatusContext } from "@/store/statusContext";
import MapResponsiveCanvas from "../maps/MapResponsiveCanvas";
import InfoBoxSheet from "./parts/InfoboxSheet";

export default function MapDisplayModule({ data, settings }: MapModuleProps) {
  const { canvasRef } = useMapMaker({ data, settings });
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
      <MapResponsiveCanvas map={map} canvasRef={canvasRef} />
      {/* Infobox Sheet */}
      {infoData && (
        <InfoBoxSheet
          sheetOpen={sheetOpen}
          setSheetOpen={setSheetOpen}
          infoData={infoData}
        />
      )}
    </div>
  );
}
