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

    // 240813 TO DO URGENT
    // DB logic issue
    // Each GlobalArea object should only have one set of nodes -> multiple areas should be multiple GlobalArea objects
    // Currently a single GlobalArea object has multiple sets of nodes

    if (!mapAreas) return;
    // move styles from node -> styles to GlobalArea
    // To Do: mapAreas[0] is a dirty fix
    console.log(mapAreas);
    mapAreas.forEach((area) => {
      const styles = area.styles;
      ctx.lineWidth = styles.lineWidth || 4;
      ctx.fillStyle = styles.fillStyle || "rgba(256, 256, 256, 0.2)";
      ctx.strokeStyle = styles.strokeStyle || "black";
      drawAreas(ctx, area, cw, ch);
    });

    // Hover actions
    // canvas.onmousemove = (e) => {
    //   checkHover(e, canvas, mapAreas, ctx, cw, ch);
    // };

    // Click actions
    canvas.onmousedown = (e) => {
      const clickedArea = checkClick(e, canvas, mapAreas, ctx, cw, ch);
      // if (!clickedArea) return;
      // const { name, id } = clickedArea[0];
      // statusCtx.showStatus({
      //   title: name,
      //   subtitle: id.toString(),
      //   status: "active",
      // });
    };
  }, []);

  return { canvasRef };
};
