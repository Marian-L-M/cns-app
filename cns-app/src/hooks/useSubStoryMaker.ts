// Temporary hook - to be unified with useStoryMaker
import { useEffect, useRef, useContext } from "react";
import { drawAreas } from "@/lib/map/drawMap";
import {
  checkClick,
  checkHover,
  checkObjectClick,
  checkStoryNodeClick,
} from "@/lib/map/mouseActions";
import { StatusContext } from "@/store/statusContext";
import { Story } from "@prisma/client";

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
  editableSubstory: Story & { nodes: StoryNode[] }; // Add the new prop
  setEditableSubstory: React.Dispatch<
    React.SetStateAction<Story & { nodes: StoryNode[] }>
  >;
}

export const useSubStoryMaker = ({
  editableSubstory,
  setEditableSubstory,
}: substoryModuleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusCtx = useContext(StatusContext);

  useEffect(() => {
    // Initialize canvas
    if (!canvasRef.current || !editableSubstory) return;
    const canvas = canvasRef.current;

    // Canvas values
    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 250130 TODO: Draw Nodes from Context
    // Add form to right side
    // Adding node adds a form block to the right side
    // Click node or form to toggle between nodes
    // Draw Story Nodes

    //250204 This check could be cleaner
    if (
      Array.isArray(editableSubstory.nodes) &&
      editableSubstory.nodes.length > 0
    ) {
      let previousNode: Point | undefined;
      editableSubstory.nodes.forEach((node: StoryNode) => {
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

      // Draw Story Nodes in separate loop for layering
      editableSubstory.nodes.forEach((node: StoryNode) => {
        drawNode(ctx, node, cw, ch);
      });
    }

    // Update canvas on click
    canvas.onmousedown = (e) => {
      // Click events
      const r = canvas.getBoundingClientRect();
      const mouseX = e.clientX - r.x;
      const mouseY = e.clientY - r.y;

      // 240204: To do hook up info list to state
      // 240204: To do click check logic
      // Node check logic -> If point in path, update node/make editable
      // check if is point in path
      // updateNode(
      //   2,
      //   {
      //     x: mouseX,
      //     y: mouseY,
      //     name: "New node",
      //     description: "New node description",
      //     timeStart: 1003,
      //     timeEnd: 1004,
      //   },
      //   setEditableSubstory
      // );

      // If not point in path, add new node
      const newNode: StoryNode = {
        id: Date.now(), // Using timestamp as a unique ID
        x: mouseX,
        y: mouseY,
        name: "New node",
        description: "New node description",
        timeStart: 1003,
        timeEnd: 1004,
      };

      addNode(newNode, setEditableSubstory);
    };
  }, [editableSubstory]);

  return { canvasRef };
};

const drawNode = (
  ctx: CanvasRenderingContext2D,
  node: StoryNode,
  cw: number,
  ch: number
) => {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo((node.x - 5) * cw, (node.y - 5) * ch);
  ctx.lineTo((node.x + 5) * cw, (node.y - 5) * ch);
  ctx.lineTo((node.x + 5) * cw, (node.y + 5) * ch);
  ctx.lineTo((node.x - 5) * cw, (node.y + 5) * ch);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
};

const addNode = (
  newNode: StoryNode,
  setEditableSubstory: React.Dispatch<
    React.SetStateAction<Story & { nodes: StoryNode[] }>
  >
) => {
  setEditableSubstory((prev) => ({
    ...prev,
    nodes: [...prev.nodes, newNode],
  }));
};

const updateNode = (
  nodeId: number,
  updates: Partial<StoryNode>,
  setEditableSubstory: React.Dispatch<
    React.SetStateAction<Story & { nodes: StoryNode[] }>
  >
) => {
  setEditableSubstory((prev) => ({
    ...prev,
    nodes: prev.nodes.map((node) =>
      node.id === nodeId ? { ...node, ...updates } : node
    ),
  }));
};

// // This should be in the useSubStoryMaker hook
// const handleNodeDrag = (nodeId: number, x: number, y: number) => {
//   updateNode(nodeId, { x, y });
// };

// const handleNodeRename = (nodeId: number, newName: string) => {
//   updateNode(nodeId, { name: newName });
// };
