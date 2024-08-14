import { useEffect, useRef, useContext } from "react";
import { drawAreas } from "@/lib/map/drawMap";
import { checkClick, checkHover } from "@/lib/map/mouseActions";
import { StatusContext } from "@/store/statusContext";

export const useMapMaker = ({ data }: MapModuleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mapAreas } = data;
  const statusCtx = useContext(StatusContext);

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
    if (!mapAreas) return;

    mapAreas.forEach((area) => {
      const styles = area.styles;
      ctx.lineWidth = styles.lineWidth || 4;
      ctx.fillStyle = styles.fillStyle || "rgba(256, 256, 256, 0.2)";
      ctx.strokeStyle = styles.strokeStyle || "black";
      drawAreas(ctx, area, cw, ch);
    });

    // Hover actions
    //240814 Split hover actions into floating label (Currenlty statusbar)
    canvas.onmousemove = (e) => {
      const hoverArea = checkHover(e, canvas, mapAreas, ctx, cw, ch);
      if (!hoverArea || hoverArea.length == 0) return;
      checkHover(e, canvas, mapAreas, ctx, cw, ch);
      const { title, id, type } = hoverArea[0];
      statusCtx.showStatusBar({
        title: title,
        id: id,
        type: type,
      });
    };

    // Click actions
    // 240814 Split click actions to show infobox
    canvas.onmousedown = (e) => {
      const clickedArea = checkClick(e, canvas, mapAreas, ctx, cw, ch);
      if (!clickedArea || clickedArea.length == 0) return;
      const { title, id, type } = clickedArea[0];
      statusCtx.showStatusBar({
        title: title,
        id: id,
        type: type,
      });
    };
  }, []);

  return { canvasRef };
};
