import { useEffect, useRef, useContext, useState } from "react";

import {
  checkClick,
  checkHover,
  checkObjectClick,
  checkStoryNodeClick,
} from "@/lib/mouseActions";
import { Map as MapType } from "@prisma/client";
import { StatusContext } from "@/store/statusContext";
import {
  drawArrowLine,
  drawStoryLabel,
  drawStoryNode,
} from "@/lib/draw/drawStory";
import {
  getValueFirstOfEachObjectType,
  getValueFirstOfEachStyleType,
} from "@/lib/utils";
import { getScaling } from "@/lib/draw/utils";

interface StoryModuleProps {
  mapData: {
    map: MapType;
    mapObjects: GlobalObjectType[];
    mapAreas: GlobalAreaType[];
  };
  story: story[];
  storyIndex: number;
  fullscreen?: boolean;
}

export function useStoryMaker({
  mapData,
  story, // To do: 250807 refactor -> this is substories
  storyIndex,
  fullscreen,
}: StoryModuleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusCtx = useContext(StatusContext);

  // Add defensive checks
  const { mapAreas = [], mapObjects = [] } = mapData || {};

  const [mapAreaLoaded, setMapAreaLoaded] = useState(false);
  const [mapObjectLoaded, setMapObjectLoaded] = useState(false);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const iconCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [iconsLoaded, setIconsLoaded] = useState(false);

  // Initialize data for canvas draw
  useEffect(() => {
    if (!mapAreas || !mapObjects) return;
    setMapAreaLoaded(true);
    setMapObjectLoaded(true);
  }, [mapAreas, mapObjects]);

  // Pre-load all images
  useEffect(() => {
    if (
      !mapObjects ||
      mapObjects.length === 0 ||
      !story ||
      story.length === 0
    ) {
      setImagesLoaded(true);
      setIconsLoaded(true);
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

    const loadIcons = async () => {
      // Check if any story nodes have iconUrl, abort if none has
      const allNodesWithImages: StoryNode[] = [];

      // Iterate through each substory and collect nodes with iconUrl
      story.forEach((substory) => {
        const nodesWithImages = substory.nodes.filter(
          (node) => node?.iconUrl && node.iconUrl.trim() !== ""
        );
        allNodesWithImages.push(...nodesWithImages);
      });

      if (allNodesWithImages.length === 0) {
        setIconsLoaded(true);
        return;
      }

      // Create promises for loading each unique icon
      const uniqueIconUrls = [
        ...new Set(allNodesWithImages.map((node) => node.iconUrl)),
      ];

      const iconPromises = uniqueIconUrls.map((iconUrl) => {
        return new Promise<void>((resolve, reject) => {
          // Check if image is already cached
          if (iconCache.current.has(iconUrl)) {
            resolve();
            return;
          }

          const img = new Image();
          img.onload = () => {
            iconCache.current.set(iconUrl, img);
            resolve();
          };
          img.onerror = reject;
          img.src = iconUrl;
        });
      });

      try {
        await Promise.all(iconPromises);
        setIconsLoaded(true);
      } catch (error) {
        console.error("Failed to load some story node icons:", error);
        setIconsLoaded(true); // Continue anyway
      }
    };

    loadImages();
    loadIcons();
  }, [mapObjects, story]);

  useEffect(() => {
    // Set canvas
    if (!canvasRef.current) return;
    if (!mapData || !mapData.mapAreas || !mapData.mapObjects) return;
    if (!imagesLoaded) return;
    if (!iconsLoaded) return;
    const canvas = canvasRef.current;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    const redrawCanvas = () => {
      // Scaling factors
      const { cw, ch } = getScaling(canvas);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Areas (Unify w usemapmaler into separate function)
      if (mapAreas) {
        mapAreas.forEach((area) => {
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
      if (mapObjects) {
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

      // Draw story
      if (story) {
        story.forEach((storyObject) => {
          drawArrowLine(ctx, storyObject, cw, ch);

          storyObject.nodes.forEach((node: StoryNode) => {
            drawStoryNode(
              ctx,
              node,
              cw,
              ch,
              iconCache,
              storyObject.nodes[storyIndex]?.id
            );
            if (node.label) {
              drawStoryLabel(ctx, node, cw, ch);
            }
          });
        });
      }
    };

    // Listen for resize events
    const resizeObserver = new ResizeObserver((entries) => {
      // Force redraw on any size change
      requestAnimationFrame(() => {
        redrawCanvas();
      });
    });

    const handleMouseMove = (e: MouseEvent) => {
      const { cw, ch } = getScaling(canvas); // inefficient?
      const hoverArea = checkHover(e, canvas, mapAreas, ctx, cw, ch);
      if (!hoverArea || hoverArea.length == 0) return;
      checkHover(e, canvas, mapAreas, ctx, cw, ch); // WHy check twice?
      const { title, id, type } = hoverArea[0];
      // 250630 to do remove
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
      const { cw, ch } = getScaling(canvas); // inefficient?
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

      // Check stories
      const clickedStoryNodes = checkStoryNodeClick(
        e,
        canvas,
        story,
        ctx,
        cw,
        ch
      );

      if (clickedStoryNodes && !(clickedStoryNodes.length == 0)) {
        const { title, id, type, description } = clickedStoryNodes[0];
        statusCtx.showStoryBox({
          title: title,
          description: description,
          id: id,
          type: type,
        });
      }
    };

    // Initialize
    // Draw contents
    redrawCanvas();

    // Redraw on resize
    resizeObserver.observe(canvas);

    // Add event listeners
    // 250530 to do Eventually should be hooked up to a sonner or sidebar infobox
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);

    // Cleanup function
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, [
    mapAreaLoaded,
    mapObjectLoaded,
    imagesLoaded,
    iconsLoaded,
    story,
    storyIndex,
    fullscreen,
  ]);

  // Cleanup image cache when component unmounts
  useEffect(() => {
    return () => {
      imageCache.current.clear();
    };
  }, []);

  return { canvasRef };
}
