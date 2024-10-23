import { useContext, useEffect, useRef } from "react";
import { draw, drawEditNodes, drawMetaNode } from "@/lib/mapEditorUtils";
import { EditorContext } from "@/store/mapEditorContext";

interface editableAreaObject {
  id: number;
  style: {};
  areaNodes: areaNode[];
}

interface areaNode {
  id: number;
  x: number;
  y: number;
}

export const useMapEditor = () => {
  const editorCtx = useContext(EditorContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 20240926 Next actions
  // 1. Draw object by clicking on map
  // 2. Add object function (preset forms)
  // 3. Object list - with names and colors
  // 4. Activated object form list
  // 5. Activated object on click
  // 6. Work on object nodes click on node to remove, drag to reposition

  // 241007 Next actions
  // If an area objects exists without nodes, it will break the map maker module

  // 241018 Next actions
  // Extract drawing loop into separate function -> It needs to run once on load + clear canvas

  //20240926 Next actions : Connect styles to UI
  let nodeList: areaNode[] = [];
  // if (nodes?.length > 0) {
  //   nodeList = nodes;
  // }

  let styles = {
    fillStyle: "rgba(0, 255, 16, 0.4)",
    lineWidth: 4,
    strokeStyle: "pink",
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Canvas values
    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Click events
    const r = canvas.getBoundingClientRect();

    // rudimentary id system
    let idCounter = editorCtx.nodeList.length;

    const redrawCanvas = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set styles
      ctx.fillStyle = styles.fillStyle || "grey";
      ctx.strokeStyle = styles.strokeStyle || "black";
      ctx.lineWidth = styles.lineWidth || 3;

      if (editorCtx.nodeList.length > 0) {
        draw(ctx, editorCtx.nodeList, cw, ch);
        drawEditNodes(ctx, editorCtx.nodeList, cw, ch);
      }
    };

    // Initial draw
    redrawCanvas();

    // Draw new ares on click
    canvas.onmousedown = (e) => {
      let existingFlag = false;
      const mouseX = e.clientX - r.x;
      const mouseY = e.clientY - r.y;

      let updatedNodes = [...editorCtx.nodeList];

      // Check for existing nodes
      updatedNodes.forEach((node: areaNode, index) => {
        drawMetaNode(ctx, node.x, node.y, cw, ch);
        if (ctx.isPointInPath(mouseX, mouseY)) {
          existingFlag = true;
          if (index === 0) {
            updatedNodes.shift();
          } else if (index === updatedNodes.length - 1) {
            updatedNodes.pop();
          } else {
            updatedNodes.splice(index, 1);
          }
        }
      });

      // Add new node if not clicking existing one
      if (!existingFlag) {
        updatedNodes.push({ id: idCounter++, x: mouseX, y: mouseY });
      }

      // Update context with new nodes
      editorCtx.updateNodeList(updatedNodes);

      // Redraw canvas
      redrawCanvas();
    };

    // Cleanup
    return () => {
      canvas.onmousedown = null;
    };
  }, [editorCtx, styles]);

  return { canvasRef, nodeList, styles };
};
