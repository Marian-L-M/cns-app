import { useEffect, useRef, useContext } from "react";
import { CursorContext } from "@/store/cursorContext";

type childMapHoverable = {
  id: number;
  title: string;
};

export const useMasterMapMaker = ({ mapChildren }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorCtx = useContext(CursorContext);

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
    if (mapChildren) {
      mapChildren.forEach((map) => {
        // const styles = area.styles;
        ctx.lineWidth = 4;
        ctx.fillStyle = "rgba(256, 256, 256, 0.2)";
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(map.x * cw, map.y * ch);
        ctx.lineTo((map.x + map.wx) * cw, map.y * ch);
        ctx.lineTo((map.x + map.wx) * cw, (map.y + map.wy) * ch);
        ctx.lineTo(map.x * cw, (map.y + map.wy) * ch);
        ctx.lineTo(map.x * cw, map.y * ch);
        ctx.closePath();
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
      for (const map of mapChildren) {
        // drawMetaChild map
        ctx.beginPath();
        ctx.moveTo(map.x * cw, map.y * ch);
        ctx.lineTo((map.x + map.wx) * cw, map.y * ch);
        ctx.lineTo((map.x + map.wx) * cw, (map.y + map.wy) * ch);
        ctx.lineTo(map.x * cw, (map.y + map.wy) * ch);
        ctx.lineTo(map.x * cw, map.y * ch);
        ctx.closePath();

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

    // Cleanup
    return () => {
      canvas.onmousemove = null;
      canvas.onmouseleave = null;
    };
  }, [mapChildren, cursorCtx]);

  return { canvasRef };
};
