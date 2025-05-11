import { useEffect, useRef } from "react";
import { Map } from "@prisma/client";

import { drawRectangularMetaArea } from "@/lib/map/drawMetaAreas";

interface MapWithRectangularArea extends Map, PointRectangularArea {}

interface MasterMapMakerProps {
  childMaps: MapWithRectangularArea[];
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
    // Draw areas
    if (childMaps) {
      childMaps.forEach((map) => {
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgba(256, 256, 256, 0.2)";
        ctx.strokeStyle = "white";
        drawRectangularMetaArea(ctx, map, cw, ch);
        ctx.font = "16px mono";
        ctx.stroke();
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.fillText(map.title, map.x * cw + 4, (map.y + map.wy) * ch - 4);
      });
    }
  });
  return { canvasRef };
}
