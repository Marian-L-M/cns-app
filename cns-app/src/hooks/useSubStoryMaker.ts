import { useEffect, useRef, useState } from "react";
import { SubStory } from "@prisma/client";
import {
  drawArrowLine,
  drawMetaNode,
  drawNode,
  drawNodeAsCircle,
  drawNodeAsDiamond,
} from "@/lib/draw/drawStory";

interface substoryModuleProps {
  editableSubStory: SubStory & { nodes: StoryNode[] };
  setEditableSubStory: React.Dispatch<
    React.SetStateAction<SubStory & { nodes: StoryNode[] }>
  >;
  activeSubstoryID?: number;
  setActiveSubstoryID: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export function useSubStoryMaker({
  editableSubStory,
  setEditableSubStory,
  activeSubstoryID,
  setActiveSubstoryID,
}: substoryModuleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Pre-load all images
  useEffect(() => {
    if (!editableSubStory.nodes || editableSubStory.nodes.length === 0) {
      setImagesLoaded(true);
      return;
    }

    const loadImages = async () => {
      // Check if nodes have image, abort if none has
      const nodesWithImages = editableSubStory.nodes.filter(
        (node) => node?.iconUrl && node.iconUrl.trim() !== ""
      );

      if (nodesWithImages.length === 0) {
        setImagesLoaded(true);
        return;
      }

      const imagePromises = editableSubStory.nodes.map((object) => {
        return new Promise<void>((resolve, reject) => {
          // Check if image is already cached
          if (imageCache.current.has(object.iconUrl)) {
            resolve();
          }

          const img = new Image();
          img.onload = () => {
            imageCache.current.set(object.iconUrl, img);
            resolve();
            return;
          };
          img.src = object.iconUrl;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
        setEditableSubStory((prev) => ({ ...prev })); // Force rerender
      } catch (error) {
        console.error("Failed to load some images:", error);
        setImagesLoaded(true);
      }
    };

    loadImages();
  }, [editableSubStory.nodes]);

  useEffect(() => {
    // Initialize canvas
    if (!canvasRef.current || !editableSubStory) return;
    const canvas = canvasRef.current;

    // Canvas values
    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Keyboard shortcuts
    const keyboardHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "e") {
        setActiveSubstoryID(undefined);
        return;
      }
    };

    const redrawCanvas = (
      canvas: HTMLCanvasElement,
      editableSubStory: SubStory & { nodes: StoryNode[] },
      ctx: CanvasRenderingContext2D,
      cw: number,
      ch: number,
      activeSubstoryID?: number
    ) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Lines
      drawArrowLine(ctx, editableSubStory, cw, ch);

      // Draw Nodes
      editableSubStory.nodes.forEach((node: StoryNode) => {
        switch (node.iconType) {
          case "CIRCLE":
            drawNodeAsCircle(ctx, node, cw, ch, activeSubstoryID);
            break;
          case "DIAMOND":
            drawNodeAsDiamond(ctx, node, cw, ch, activeSubstoryID);
            break;
          case "ICON":
            if (node.iconUrl && node.iconUrl.trim() !== "") {
              const cachedIcon = imageCache.current.get(node.iconUrl);
              if (cachedIcon) {
                drawNodeAsCircle(ctx, node, cw, ch, activeSubstoryID);
                const iconSize = node.iconSize || 20;
                ctx.save();
                ctx.drawImage(
                  cachedIcon,
                  (node.x - iconSize / 2) * cw,
                  (node.y - iconSize / 2) * ch,
                  iconSize,
                  iconSize
                );
                ctx.restore();
              } else {
                // Fallback to default node rendering if image not cached
                console.log("no cache");
                drawNode(ctx, node, cw, ch, activeSubstoryID);
              }
            } else {
              // Fallback to default node rendering when no iconUrl
              console.log("no icon");
              drawNode(ctx, node, cw, ch, activeSubstoryID);
            }
            break;
          default:
            drawNode(ctx, node, cw, ch, activeSubstoryID);
        }
      });
    };

    //250204 This check could be cleaner
    if (
      Array.isArray(editableSubStory.nodes) &&
      editableSubStory.nodes.length > 0
    ) {
      redrawCanvas(canvas, editableSubStory, ctx, cw, ch, activeSubstoryID);
    }

    // Update canvas on click
    canvas.onmousedown = (e) => {
      // Click events
      const r = canvas.getBoundingClientRect();
      const mouseX = e.clientX - r.x;
      const mouseY = e.clientY - r.y;
      let nodeClicked = false;

      // Check if node clicked
      editableSubStory.nodes.forEach((node: StoryNode) => {
        drawMetaNode(ctx, node, cw, ch);
        if (ctx.isPointInPath(mouseX, mouseY)) {
          if (activeSubstoryID === node.id) {
            setActiveSubstoryID(undefined);
          } else {
            setActiveSubstoryID(node.id);
          }
          nodeClicked = true;
          return;
        }
      });

      // If not point in path and edit mode update active node position
      if (!nodeClicked && activeSubstoryID) {
        updateNode(
          activeSubstoryID,
          { x: mouseX, y: mouseY },
          setEditableSubStory
        );
      } else if (!nodeClicked) {
        // If not point in path and not edit mode, add new node
        const newNode: StoryNode = {
          id: Date.now(),
          x: mouseX,
          y: mouseY,
          name: "New node",
          description: "New node description",
          timeStart: 1003,
          timeEnd: 1004,
          iconType: "rectangle",
          iconUrl: "",
          iconSize: 10,
          iconColor: "#ffffff",
          label: false,
          labelColor: "#000000",
          fontColor: "#000000",
        };

        addNode(newNode, setEditableSubStory);
      } else {
        return;
      }
      // Keyboard actions
      window.addEventListener("keydown", keyboardHandler);

      // Update canvas
      redrawCanvas(canvas, editableSubStory, ctx, cw, ch, activeSubstoryID);

      // Cleanup
      return () => {
        canvas.onmousedown = null;
      };
    };
  }, [
    editableSubStory,
    activeSubstoryID,
    imageCache,
    setActiveSubstoryID,
    setEditableSubStory,
    imagesLoaded, // 250725 Issue
  ]);

  return { canvasRef };
}

const addNode = (
  newNode: StoryNode,
  setEditableSubStory: React.Dispatch<
    React.SetStateAction<SubStory & { nodes: StoryNode[] }>
  >
) => {
  setEditableSubStory((prev) => ({
    ...prev,
    nodes: [...prev.nodes, newNode],
  }));
};

const updateNode = (
  nodeId: number,
  updates: Partial<StoryNode>,
  setEditableSubStory: React.Dispatch<
    React.SetStateAction<SubStory & { nodes: StoryNode[] }>
  >
) => {
  setEditableSubStory((prev) => ({
    ...prev,
    nodes: prev.nodes.map((node) =>
      node.id === nodeId ? { ...node, ...updates } : node
    ),
  }));
};
