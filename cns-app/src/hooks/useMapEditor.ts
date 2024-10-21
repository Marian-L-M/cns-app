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
  // let nodes: areaNode[] = [
  //   { id: 1, x: 0, y: 298 },
  //   { id: 2, x: 25, y: 304 },
  //   { id: 3, x: 48, y: 304 },
  //   { id: 4, x: 22, y: 179 },
  //   { id: 5, x: 11, y: 193 },
  // ];

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
    let idCounter = 0;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw initial
    ctx.fillStyle = styles.fillStyle || "grey";
    ctx.strokeStyle = styles.strokeStyle || "black";
    ctx.lineWidth = styles.lineWidth || 3;

    if (nodeList.length > 0) {
      draw(ctx, nodeList, cw, ch);
      drawEditNodes(ctx, nodeList, cw, ch);
    }

    // Draw new ares on click
    canvas.onmousedown = (e) => {
      let existingFlag = false;
      const mouseX = e.clientX - r.x;
      const mouseY = e.clientY - r.y;

      // If existing node remove from nodelist
      nodeList.forEach((node: areaNode, index) => {
        drawMetaNode(ctx, node.x, node.y, cw, ch);
        if (ctx.isPointInPath(mouseX, mouseY)) {
          if (index == 0) {
            nodeList.shift();
          } else if (index == nodeList.length - 1) {
            nodeList.pop();
          } else {
            nodeList.splice(index, index);
          }

          // Set existing flag
          existingFlag = true;

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Redraw nodes
          draw(ctx, nodeList, cw, ch);
          drawEditNodes(ctx, nodeList, cw, ch);
          return;
        }
      });

      // If not existing node add to nodelist
      if (!existingFlag) {
        nodeList.push({ id: idCounter, x: mouseX, y: mouseY });
        idCounter++;

        if (nodeList.length > 0) {
          ctx.fillStyle = styles.fillStyle || "grey";
          ctx.strokeStyle = styles.strokeStyle || "black";
          ctx.lineWidth = styles.lineWidth || 3;
          draw(ctx, nodeList, cw, ch);
          drawEditNodes(ctx, nodeList, cw, ch);
        }
        return;
      }

      // editorCtx.nodeList = nodeList;
      editorCtx.updateNodeList(nodeList);
      return;
    };
  }, [nodeList]);
  return { canvasRef, nodeList, styles };
};
