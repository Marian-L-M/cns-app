import { useEffect, useRef } from "react";
import { CanvasStyleItem } from "@prisma/client";

import { drawMasterMapArea } from "@/lib/map/drawMap";
import { getValueFirstOfEachStyleType } from "@/lib/utils";

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

interface MasterMapMakerProps {
  childMaps: ChildMap[];
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
