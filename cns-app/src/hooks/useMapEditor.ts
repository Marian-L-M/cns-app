import { useEffect, useRef } from "react";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (
    ctx: CanvasRenderingContext2D,
    area: areaNode[],
    cw: number,
    ch: number
  ) => {
    // current drawArea function is nonsensical (nested nodes structure used in mapmaker -> Find better way to unify)
    ctx.beginPath();
    ctx.moveTo(area[0].x * cw, area[0].y * ch);
    for (var i = 1; i < area.length; i++) {
      ctx.lineTo(area[i].x * cw, area[i].y * ch);
    }
    ctx.lineTo(area[0].x * cw, area[0].y * ch);
    ctx.closePath;
    ctx.stroke();
    ctx.fill();
  };
  const drawEditNodes = (
    ctx: CanvasRenderingContext2D,
    area: areaNode[],
    cw: number,
    ch: number
  ) => {
    const offset = 5;
    area.forEach((node, index) => {
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      ctx.moveTo(node.x * cw - offset, node.y * ch - offset);
      ctx.lineTo(node.x * cw + offset, node.y * ch - offset);
      ctx.lineTo(node.x * cw + offset, node.y * ch + offset);
      ctx.lineTo(node.x * cw - offset, node.y * ch + offset);
      ctx.lineTo(node.x * cw - offset, node.y * ch - offset);
      ctx.closePath;
      ctx.stroke();
      ctx.fill();
    });
  };
  const drawMetaNode = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cw: number,
    ch: number
  ) => {
    const offset = 7;
    ctx.beginPath();
    ctx.moveTo(x * cw - offset, y * ch - offset);
    ctx.lineTo(x * cw + offset, y * ch - offset);
    ctx.lineTo(x * cw + offset, y * ch + offset);
    ctx.lineTo(x * cw - offset, y * ch + offset);
    ctx.lineTo(x * cw - offset, y * ch - offset);
    ctx.closePath;
  };

  // 20240926 Next actions
  // 1. Draw object by clicking on map
  // 2. Add object function (preset forms)
  // 3. Object list - with names and colors
  // 4. Activated object form list
  // 5. Activated object on click
  // 6. Work on object nodes click on node to remove, drag to reposition
  let nodeList: areaNode[] = [];
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Canvas values
    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // // Clear canvas
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Click events

    const r = canvas.getBoundingClientRect();

    // rudimentary id system
    let idCounter = 0;

    // Draw area
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
          ctx.fillStyle = "grey";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 3;
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
          ctx.fillStyle = "grey";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 3;
          draw(ctx, nodeList, cw, ch);
          drawEditNodes(ctx, nodeList, cw, ch);
        }
        return;
      }
      return;
    };
  }, [nodeList]);
  return { canvasRef, nodeList };
};
