import { useEffect, useRef, useState, useCallback } from "react";
import { SubStory } from "@prisma/client";
import {
  drawArrowLine,
  drawMetaNode,
  drawNode,
  drawNodeAsCircle,
  drawNodeAsDiamond,
  drawStoryNode,
} from "@/lib/draw/drawStory";

interface substoryModuleProps {
  editableSubStory: SubStory & { nodes: StoryNode[] };
  setEditableSubStory: React.Dispatch<
    React.SetStateAction<SubStory & { nodes: StoryNode[] }>
  >;
  activeSubstoryID?: number;
  setActiveSubstoryID: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export function useSubStoryEditor({
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

      const imagePromises = nodesWithImages.map((node) => {
        return new Promise<void>((resolve, reject) => {
          // Check if image is already cached
          if (imageCache.current.has(node.iconUrl)) {
            resolve();
            return;
          }

          const img = new Image();
          img.onload = () => {
            imageCache.current.set(node.iconUrl, img);
            resolve();
          };
          img.onerror = () => {
            console.warn(`Failed to load image: ${node.iconUrl}`);
            reject(new Error(`Failed to load image: ${node.iconUrl}`));
          };
          img.src = node.iconUrl;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Failed to load some images:", error);
        // Continue even if images fail to load
        setImagesLoaded(true);
      }
    };

    setImagesLoaded(false);
    loadImages();
  }, [editableSubStory.nodes]);

  // Memoized redraw function
  const redrawCanvas = useCallback(() => {
    if (!canvasRef.current || !editableSubStory) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas values
    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Only draw if we have nodes
    if (
      !Array.isArray(editableSubStory.nodes) ||
      editableSubStory.nodes.length === 0
    ) {
      return;
    }

    // Draw Lines
    drawArrowLine(ctx, editableSubStory, cw, ch);

    // Draw Nodes
    editableSubStory.nodes.forEach((node: StoryNode) => {
      drawStoryNode(ctx, node, cw, ch, imageCache, activeSubstoryID);
    });
  }, [editableSubStory, activeSubstoryID, imagesLoaded]);

  // Effect to handle mouse events and keyboard shortcuts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !editableSubStory) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;

    // Keyboard shortcuts
    const keyboardHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "e") {
        setActiveSubstoryID(undefined);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
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
          iconType: "SQUARE",
          iconUrl: "",
          iconSize: 10,
          iconColor: "#ffffff",
          label: false,
          labelColor: "#000000",
          fontColor: "#000000",
        };

        addNode(newNode, setEditableSubStory);
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", keyboardHandler);

    // Cleanup
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("keydown", keyboardHandler);
    };
  }, [
    editableSubStory,
    activeSubstoryID,
    setActiveSubstoryID,
    setEditableSubStory,
  ]);

  redrawCanvas();
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
