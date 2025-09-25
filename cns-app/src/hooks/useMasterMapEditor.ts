import { useEffect, useRef } from "react";
import { CanvasStyleItem, MapHierarchyChild } from "@prisma/client";

import { drawMasterMapArea } from "@/lib/map/drawMap";
import { getValueFirstOfEachStyleType } from "@/lib/utils";

type MapHierarchyChildWithRelations = MapHierarchyChild & {
  childMap: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    mapUrl: string;
    mapWidth: number;
    mapHeight: number;
    canvasAspectRatio: number;
    category: string;
    tags: string[];
    featured: boolean;
    mapTime: number;
    slug: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  canvasStyles: CanvasStyleItem[];
};

interface MasterMapMakerProps {
  childMaps: MapHierarchyChildWithRelations[];
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
