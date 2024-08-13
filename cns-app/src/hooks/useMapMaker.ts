import { useEffect, useRef, useContext } from "react";
import { drawAreas } from "@/lib/map/drawMap";
import { checkClick, checkHover } from "@/lib/map/mouseActions";
import StatusContext from "@/store/statusContext";
// import { statusInfo } from "../components/maps/MapModule";

export const useMapMaker = ({ data }: MapModuleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mapAreas } = data;
  const statusCtx = useContext(StatusContext);

  // const { statusBarHandler } = statusInfo();

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
    mapAreas?.forEach((area: GlobalAreaType) => {
      ctx.lineWidth = area.styles?.lineWidth || 4;
      area.nodes.forEach((node: DrawMapArea) => {
        drawAreas(ctx, node, cw, ch);
      });
    });

    // Hover actions
    canvas.onmousemove = (e) => {
      checkHover(e, canvas, mapAreas, ctx, cw, ch);
    };

    // Click actions
    canvas.onmousedown = (e) => {
      const clickedArea = checkClick(e, canvas, mapAreas, ctx, cw, ch);
      if (!clickedArea) return;
      const { name, id } = clickedArea[0];
      statusCtx.showStatus({
        title: name,
        subtitle: id.toString(),
        status: "active",
      });
    };
  }, []);

  return { canvasRef };
};
