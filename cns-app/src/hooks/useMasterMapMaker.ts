import { useRouter } from "next/navigation";
import { useEffect, useRef, useContext } from "react";

import { checkHitbox } from "@/lib/mouseActions";
import { drawRectangularMetaArea } from "@/lib/map/drawMetaAreas";
import { CanvasStyleItem } from "@prisma/client";
import { CursorContext } from "@/store/cursorContext";
import { getScaling } from "@/lib/draw/utils";
import { getValueFirstOfEachStyleType } from "@/lib/utils";
import { drawMasterMapArea } from "@/lib/map/drawMap";

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
  fullscreen: boolean;
}

export function useMasterMapMaker({
  childMaps,
  fullscreen,
}: MasterMapMakerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorCtx = useContext(CursorContext);
  const router = useRouter();

  useEffect(() => {
    // Set canvas
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const redrawCanvas = () => {
      // Scaling factors
      const { cw, ch } = getScaling(canvas);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Areas
      if (childMaps) {
        childMaps.forEach((map) => {
          const styles = getValueFirstOfEachStyleType(map.canvasStyles);
          drawMasterMapArea(ctx, map, styles, cw, ch);
        });
      }
    };

    // Listen for resize events
    const resizeObserver = new ResizeObserver(() => {
      // Force redraw on any size change
      requestAnimationFrame(() => {
        redrawCanvas();
      });
    });

    // Hover actions
    const handleMouseMove = (e: MouseEvent) => {
      // Scaling factors
      const { cw, ch } = getScaling(canvas);
      const r = canvas.getBoundingClientRect();
      const mouseX = e.clientX - r.x;
      const mouseY = e.clientY - r.y;

      let hoveredMap = null;
      // mapChildren.forEach((map) => {
      for (const map of childMaps) {
        drawRectangularMetaArea(ctx, map, cw, ch);

        if (ctx.isPointInPath(mouseX, mouseY)) {
          hoveredMap = map;
          break;
        }
      }
      if (hoveredMap) {
        cursorCtx.showMouseTooltip({
          id: hoveredMap.id,
          title: hoveredMap.title,
          imageUrl: hoveredMap.imageUrl,
        });
      } else {
        cursorCtx.hideMouseTooltip();
      }

      canvas.onmouseleave = () => {
        cursorCtx.hideMouseTooltip();
      };
    };

    // Click actions
    const handleMouseDown = (e: MouseEvent) => {
      // Scaling factors
      const { cw, ch } = getScaling(canvas);

      // Go to clicked map
      const hitArea = checkHitbox(e, canvas, childMaps, ctx, cw, ch);
      if (hitArea && !(hitArea.length == 0)) {
        const { id } = hitArea[0];
        router.push(`/maps/${id}`);
        router.refresh();
      }
    };

    // Initialize
    // Draw contents
    redrawCanvas();

    // Redraw on resize
    resizeObserver.observe(canvas);

    // Add event listeners
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);

    // Cleanup function
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      resizeObserver.disconnect();
    };
  }, [childMaps, cursorCtx, fullscreen]);

  return { canvasRef };
}
