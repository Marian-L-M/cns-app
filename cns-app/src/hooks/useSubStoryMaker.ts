// Temporary hook - to be unified with useStoryMaker
import { useEffect, useRef } from "react";
import { SubStory } from "@prisma/client";

type StoryNode = {
  id: number;
  x: number;
  y: number;
  name: string;
  description: string;
  timeStart?: number;
  timeEnd?: number;
};

interface substoryModuleProps {
  editableSubStory: SubStory & { nodes: StoryNode[] }; // Add the new prop
  setEditableSubStory: React.Dispatch<
    React.SetStateAction<SubStory & { nodes: StoryNode[] }>
  >;
  activeSubstoryID?: number;
  setActiveSubstoryID: React.Dispatch<React.SetStateAction<number | undefined>>;
}

export const useSubStoryMaker = ({
  editableSubStory,
  setEditableSubStory,
  activeSubstoryID,
  setActiveSubstoryID,
}: substoryModuleProps) => {
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
  let previousNode: Point | undefined;
  editableSubStory.nodes.forEach((node: StoryNode) => {
    // Draw Story Line
    if (previousNode) {
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.moveTo(previousNode.x * cw, previousNode.y * ch);
      ctx.lineTo(node.x * cw, node.y * ch);
      ctx.closePath;
      ctx.stroke();
    }
    previousNode = { x: node.x, y: node.y };
  });

  // Draw Nodes
  editableSubStory.nodes.forEach((node: StoryNode) => {
    drawNode(ctx, node, cw, ch, activeSubstoryID);
  });
};

// 250217 Todo: make code less dry
const drawNode = (
  ctx: CanvasRenderingContext2D,
  node: StoryNode,
  cw: number,
  ch: number,
  activeSubstoryID?: number
) => {
  if (activeSubstoryID === node.id) {
    drawNodeSquare(ctx, node.x, node.y, cw, ch, 10, "yellow", "black");
    drawNodeSquare(ctx, node.x, node.y, cw, ch, 5, "blue", "none");
  } else {
    drawNodeSquare(ctx, node.x, node.y, cw, ch, 5, "red", "black");
  }
};

// Unify with useMapEditor drawmeta node)
const drawMetaNode = (
  ctx: CanvasRenderingContext2D,
  node: StoryNode,
  cw: number,
  ch: number
) => {
  drawNodeSquare(ctx, node.x, node.y, cw, ch, 10, "unset", "unset");
};

const drawNodeSquare = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cw: number,
  ch: number,
  offset: number,
  fillStyle?: string,
  strokeStyle?: string
) => {
  ctx.beginPath();
  ctx.lineWidth = 1;
  fillStyle ? (ctx.fillStyle = fillStyle) : (ctx.fillStyle = "none");
  strokeStyle ? (ctx.strokeStyle = strokeStyle) : (ctx.strokeStyle = "none");
  ctx.moveTo((x - offset) * cw, (y - offset) * ch);
  ctx.lineTo((x + offset) * cw, (y - offset) * ch);
  ctx.lineTo((x + offset) * cw, (y + offset) * ch);
  ctx.lineTo((x - offset) * cw, (y + offset) * ch);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "none";
  ctx.strokeStyle = "none";
};

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
