import { useEffect, useRef, useContext } from "react";
import { CursorContext } from "@/store/cursorContext";
import { checkHitbox } from "@/lib/map/mouseActions";
import { useRouter } from "next/navigation";
import { drawRectangularMetaArea } from "@/lib/map/drawMetaAreas";
import { Map } from "@prisma/client";
interface MapWithRectangularArea extends Map, PointRectangularArea {}

interface MasterMapMakerProps {
  childMaps: MapWithRectangularArea[];
}

export const useMasterMapMaker = ({ childMaps }: MasterMapMakerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorCtx = useContext(CursorContext);
  const router = useRouter();

  useEffect(() => {
    // Set canvas
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

    // Draw Areas
    // 240811 Unify draw functions or keep together for future expansion?
    // 250318 Unify with map maker check hover, click - should all be one function
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

    // Hover actions
    canvas.onmousemove = (e) => {
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

    canvas.onmousedown = (e) => {
      // Go to clicked map
      const hitArea = checkHitbox(e, canvas, childMaps, ctx, cw, ch);
      if (hitArea && !(hitArea.length == 0)) {
        const { id } = hitArea[0];
        router.push(`/maps/${id}`);
      }
    };

    // Cleanup
    return () => {
      canvas.onmousemove = null;
      canvas.onmouseleave = null;
    };
  }, [childMaps, cursorCtx]);

  return { canvasRef };
};
