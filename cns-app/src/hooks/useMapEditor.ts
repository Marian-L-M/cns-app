import { useContext, useEffect, useRef, useState } from "react";
import { draw, drawEditNodes, drawMetaNode } from "@/lib/mapEditorUtils";
import { EditorContext } from "@/store/mapEditorContext";
import { z } from "zod";
import { GlobalObjectsSchema } from "@/ValidationSchemas/global";

interface areaNode {
  id: number;
  x: number;
  y: number;
}

// Rewrite useMapEditor as a relay between useAreaEditor and useObjectEditor
export const useMapEditor = ({ globalArea, globalObject }: any) => {
  if (globalArea) {
    const { canvasRef } = useAreaEditor(globalArea?.nodes, globalArea?.styles);
    return { canvasRef };
  } else if (globalObject) {
    const { canvasRef } = useObjectEditor(globalObject);
    return { canvasRef };
  }
  const canvasRef = "";

  return { canvasRef };
};

function useAreaEditor(nodes?: areaNode[], styles?: any) {
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

  // Initialize context
  useEffect(() => {
    if (!nodes) return;
    editorCtx.updateNodeList(nodes); // Working, but in Prisma Schema declared as JSON not list of objects
    editorCtx.pickObjectColor(styles.fillStyle);
    editorCtx.pickLineColor(styles.strokeStyle);
    editorCtx.pickLineWidth(styles.lineWidth);
  }, []);

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
      ctx.fillStyle = editorCtx.objectColor || "grey";
      ctx.strokeStyle = editorCtx.objectLineColor || "black";
      ctx.lineWidth = editorCtx.objectLineWidth || 3;

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

          // Create a new array with the node removed and update context
          const filteredNodes = updatedNodes.filter((_, i) => i !== index);
          editorCtx.updateNodeList(filteredNodes);

          return;
        }
      });

      // Add new node if not clicking existing one
      if (!existingFlag) {
        updatedNodes.push({ id: idCounter++, x: mouseX, y: mouseY });
        // Update context with new nodes
        editorCtx.updateNodeList(updatedNodes);
      }

      // Redraw canvas
      redrawCanvas();
    };

    // Cleanup
    return () => {
      canvas.onmousedown = null;
    };
  }, [editorCtx]);
  return { canvasRef };
}

function useObjectEditor(globalObject: any) {
  const editorCtx = useContext(EditorContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editState, setEditState] = useState(false);
  const thumbSize = 40;

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

    // Draw initial icon
    drawIcon(thumbSize, ctx, globalObject, cw, ch);

    // Icon outder bounds
    const thumbDiameter = thumbSize / 2;
    const icon = {
      left: globalObject.x * cw - thumbDiameter,
      right: globalObject.x * cw + thumbDiameter,
      top: globalObject.y * ch - thumbDiameter,
      bottom: globalObject.y * ch + thumbDiameter,
    };

    // Activate editor mode if icon is clicked
    canvas.onmousedown = (e) => {
      const mouseX = e.clientX - r.x;
      const mouseY = e.clientY - r.y;
      // Check if existing image is clicked
      if (
        mouseX > icon.left &&
        mouseX < icon.right &&
        mouseY > icon.top &&
        mouseY < icon.bottom
      ) {
        setEditState(true);
      } else {
        setEditState(false);

        // // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw icon
        drawIcon(thumbSize, ctx, globalObject, cw, ch);
      }

      // // update image position
      // globalObject.x = mouseX;
      // globalObject.y = mouseY;

      // // Draw image
      // const image = new Image(); // Using optional size for image
      // image.src = `/${globalObject.thumbUrl}`;
      // image.onload = () => {
      //   ctx.drawImage(
      //     image,
      //     globalObject.x * cw - thumbSize / 2,
      //     globalObject.y * ch - thumbSize / 2,
      //     thumbSize,
      //     thumbSize
      //   );
      // };
      // if (editState) {
      //   alert("activated edit mode");
      //   // Draw Edit Frame
      //   // ctx.beginPath();
      //   // ctx.moveTo
      // }
    };
    if (editState) {
      ctx.strokeStyle = "pink";
      ctx.lineWidth = 5;
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(icon.left - 5, icon.top - 5);
      ctx.lineTo(icon.right + 5, icon.top - 5);
      ctx.lineTo(icon.right + 5, icon.bottom + 5);
      ctx.lineTo(icon.left - 5, icon.bottom + 5);
      ctx.lineTo(icon.left - 5, icon.top - 7.5);
      ctx.closePath;
      ctx.stroke();
    }
  }, [editState]);

  return { canvasRef };
}

//241203 -> To do: Create a draw image function and hook up to context
export function drawIcon(
  thumbSize: number,
  ctx: CanvasRenderingContext2D,
  globalObject: GlobalObjectType,
  cw: number,
  ch: number
) {
  const icon = new Image();
  const thumbDiamater = thumbSize / 2;

  icon.src = `/${globalObject.thumbUrl}`;
  icon.onload = () => {
    ctx.drawImage(
      icon,
      globalObject.x * cw - thumbDiamater,
      globalObject.y * ch - thumbDiamater,
      thumbSize,
      thumbSize
    );
  };
}
