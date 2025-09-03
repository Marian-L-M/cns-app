import { useEffect, useRef } from "react";
import { Map } from "@prisma/client";

import { drawMasterMapArea } from "@/lib/map/drawMap";
import { getValueFirstOfEachStyleType } from "@/lib/utils";

interface MapWithRectangularArea extends Map, PointRectangularArea {}

interface MasterMapMakerProps {
  childMaps: MapWithRectangularArea[]; // Types fucked up, add canvas styles
}

export function useMasterMapEditor({ childMaps }: MasterMapMakerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Canvas values
    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw master map areas
    if (childMaps) {
      childMaps.forEach((map) => {
        const styles = getValueFirstOfEachStyleType(map.canvasStyles);
        console.log(styles);
        drawMasterMapArea(ctx, map, styles, cw, ch);
      });
    }
  });
  return { canvasRef };
}
