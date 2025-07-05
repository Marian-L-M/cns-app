import { useEffect, useRef } from "react";
import { SubStory } from "@prisma/client";
import {
  drawArrowLine,
  drawMetaNode,
  drawNode,
  drawNodeSquare,
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
  }, [editableSubStory, activeSubstoryID]);

  return { canvasRef };
}

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
    drawNode(ctx, node, cw, ch, activeSubstoryID);
  });
};

// 250217 Todo: make code less dry

// Unify with useMapEditor drawmeta node)

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
