import {
  useEffect,
  useRef,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import { drawAreas } from "@/lib/map/drawMap";
import {
  checkClick,
  checkHover,
  checkObjectClick,
} from "@/lib/map/mouseActions";
import { StatusContext } from "@/store/statusContext";

export function useMapMaker({ data, settings }: MapModuleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusCtx = useContext(StatusContext);
  const { mapAreas, mapObjects } = data;
  const [mapAreaLoaded, setMapAreaLoaded] = useState(false);
  const [mapObjectLoaded, setMapObjectLoaded] = useState(false);

  // Initialize data for canvas draw
  // Canvas draw will fail if passed directly
  // Seems like a dumb solution
  useEffect(() => {
    if (!mapAreas) return;
    setMapAreaLoaded(true);
  }, []);

  useEffect(() => {
    if (!mapObjects) return;
    setMapObjectLoaded(true);
  }, []);

  useEffect(() => {
    // Set canvas
    if (!canvasRef.current) return;
    if (!data || !data.mapAreas || !data.mapObjects) return;
    const canvas = canvasRef.current;

    // Canvas values
    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const redrawCanvas = () => {
      // Draw Areas
      if (mapAreas && !(settings == "objects")) {
        mapAreas.forEach((area, index) => {
          const styles = area.styles;
          ctx.lineWidth = styles.lineWidth || 4;
          ctx.fillStyle = styles.fillStyle || "rgb(255, 255, 255)";
          ctx.strokeStyle = styles.strokeStyle || "black";

          // drawAreas(ctx, area, cw, ch);
          ctx.beginPath();
          ctx.moveTo(area.nodes[0].x * cw, area.nodes[0].y * ch);
          for (var i = 1; i < area.nodes.length; i++) {
            const point = {
              x: area.nodes[i].x * cw,
              y: area.nodes[i].y * ch,
            };
            ctx.lineTo(point.x, point.y);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.fill();
        });
      }

      // Draw Objects
      if (mapObjects && !(settings == "areas")) {
        mapObjects.forEach((object) => {
          const thumbSize = 40;
          const image = new Image(); // Using optional size for image
          image.src = `${object.thumbUrl}`;
          image.onload = () => {
            ctx.drawImage(
              image,
              object.x * cw - thumbSize / 2,
              object.y * ch - thumbSize / 2,
              thumbSize,
              thumbSize
            );
          };
        });
      }
    };

    // Initial draw
    redrawCanvas();

    // Hover actions
    // 240814 Split hover actions into floating label (Currenlty statusbar)
    canvas.onmousemove = (e) => {
      const hoverArea = checkHover(e, canvas, mapAreas, ctx, cw, ch);
      if (!hoverArea || hoverArea.length == 0) return;
      checkHover(e, canvas, mapAreas, ctx, cw, ch); // WHy check twice?
      const { title, id, type } = hoverArea[0];
      statusCtx.showStatusBar({
        title: title,
        id: id,
        type: type,
      });
    };

    // Click actions
    // 240814 Split click actions to show infobox
    // 240818 Join mapAreas and mapObjects click events
    canvas.onmousedown = (e) => {
      // Check areas
      const clickedArea = checkClick(e, canvas, mapAreas, ctx, cw, ch);
      if (clickedArea && !(clickedArea.length == 0)) {
        const { title, id, type } = clickedArea[0];
        statusCtx.showInfoBox({
          title: title,
          id: id,
          type: type,
        });
      }

      // Check objects
      const clickedObjects = checkObjectClick(
        e,
        canvas,
        mapObjects,
        ctx,
        cw,
        ch
      );
      if (clickedObjects && !(clickedObjects.length == 0)) {
        const { title, id, type } = clickedObjects[0];
        statusCtx.showInfoBox({
          title: title,
          id: id,
          type: type,
        });
      }
    };
  }, [mapAreaLoaded, mapObjectLoaded]);
  return { canvasRef };
}
