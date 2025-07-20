import { useEffect, useRef, useContext, useState } from "react";
import {
  checkClick,
  checkHover,
  checkObjectClick,
} from "@/lib/map/mouseActions";
import { StatusContext } from "@/store/statusContext";
import {
  getValueFirstOfEachObjectType,
  getValueFirstOfEachStyleType,
} from "@/lib/utils";

export function useMapMaker({ data, settings }: MapModuleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusCtx = useContext(StatusContext);
  const { mapAreas, mapObjects } = data;
  const [mapAreaLoaded, setMapAreaLoaded] = useState(false);
  const [mapObjectLoaded, setMapObjectLoaded] = useState(false);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map()); // Cache images to prevent asynchronous loading issue duplicate images drawn on multiple canvas in tabs
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Initialize data for canvas draw
  useEffect(() => {
    if (!mapAreas) return;
    setMapAreaLoaded(true);
  }, []);

  useEffect(() => {
    if (!mapObjects) return;
    setMapObjectLoaded(true);
  }, []);

  // Pre-load all images
  useEffect(() => {
    if (!mapObjects || mapObjects.length === 0) {
      setImagesLoaded(true);
      return;
    }

    const loadImages = async () => {
      const imagePromises = mapObjects.map((object) => {
        return new Promise<void>((resolve, reject) => {
          // Check if image is already cached
          if (imageCache.current.has(object.iconUrl)) {
            resolve();
            return;
          }

          const img = new Image();
          img.onload = () => {
            imageCache.current.set(object.iconUrl, img);
            resolve();
          };
          img.onerror = reject;
          img.src = object.iconUrl;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Failed to load some images:", error);
        setImagesLoaded(true); // Continue anyway
      }
    };

    loadImages();
  }, [mapObjects]);

  useEffect(() => {
    // Set canvas
    if (!canvasRef.current) return;
    if (!data || !data.mapAreas || !data.mapObjects) return;
    if (!imagesLoaded) return;

    const canvas = canvasRef.current;

    // Canvas values
    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get relevant styles

    const redrawCanvas = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Areas
      if (mapAreas && !(settings == "objects")) {
        mapAreas.forEach((area, index) => {
          if (area.canvasStyles) {
            const filteredStyle = getValueFirstOfEachStyleType(
              area.canvasStyles
            );
            ctx.lineWidth = parseInt(filteredStyle.lineWidth) || 4;
            ctx.fillStyle = filteredStyle.fillStyle || "rgb(255, 255, 255)";
            ctx.strokeStyle = filteredStyle.strokeStyle || "black";
          } else {
            // ugly solution
            ctx.lineWidth = 4;
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            ctx.strokeStyle = "black";
          }

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

      // Draw objects w preloaded images
      if (mapObjects && settings !== "areas") {
        mapObjects.forEach((object) => {
          const cachedImage = imageCache.current.get(object.iconUrl);

          // Style settings
          const styles = getValueFirstOfEachObjectType(object.canvasStyles);
          const thumbSize = parseInt(styles.size) | 40;
          const thumbRadius = thumbSize / 2;
          const opacity = parseInt(styles.opacity) / 100;

          if (cachedImage) {
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.drawImage(
              cachedImage,
              object.x * cw - thumbRadius,
              object.y * ch - thumbRadius,
              thumbSize,
              thumbSize
            );
            ctx.restore();
          }
        });
      }
    };

    // Draw contents
    redrawCanvas();

    // Hover actions
    // 240814 Split hover actions into floating label (Currenlty statusbar)
    const handleMouseMove = (e: MouseEvent) => {
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
    const handleMouseDown = (e: MouseEvent) => {
      // Check areas
      const clickedArea = checkClick(e, canvas, mapAreas, ctx, cw, ch);
      if (clickedArea && !(clickedArea.length == 0)) {
        const { title, id, type } = clickedArea[0];
        statusCtx.showInfoBox({
          title: title,
          id: id,
          type: type,
        });
        return;
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

    // Add event listeners
    // 250530 to do Eventually should be hooked up to a sonner or sidebar infobox
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);

    // Cleanup function
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, [mapAreaLoaded, mapObjectLoaded, imagesLoaded, settings]);

  // Cleanup image cache when component unmounts
  useEffect(() => {
    return () => {
      imageCache.current.clear();
    };
  }, []);

  return { canvasRef };
}
