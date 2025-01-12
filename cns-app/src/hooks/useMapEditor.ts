import { useContext, useEffect, useRef, useState } from "react";
import { draw, drawEditNodes, drawMetaNode } from "@/lib/mapEditorUtils";
import { EditorContext } from "@/store/mapEditorContext";
import { z } from "zod";
import { GlobalObjectsSchema } from "@/ValidationSchemas/global";
import EditMapObjects from "@/app/maps/[id]/edit/objects/page";

interface areaNode {
  id: number;
  x: number;
  y: number;
}

interface IconBounds {
  left: number;
  right: number;
  bottom: number;
  top: number;
}

// Rewrite useMapEditor as a relay between useAreaEditor and useObjectEditor
export const useMapEditor = ({
  globalArea,
  globalObject,
  editorMode,
}: any = {}) => {
  // 2025011 Todo implement area editormode logic
  // if (globalArea && editorMode == "area") {
  if (globalArea || editorMode == "area") {
    const { canvasRef } = useAreaEditor(globalArea?.nodes, globalArea?.styles);
    return { canvasRef };
  } else if (globalObject || editorMode == "object") {
    const { canvasRef } = useObjectEditor(globalObject);
    return { canvasRef };
  }
  const canvasRef = useRef(null);
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
  const [isEditing, setIsEditing] = useState(false);
  const [iconBounds, setIconBounds] = useState<IconBounds | null>(null);
  const thumbSize = 40;
  const thumbRadius = thumbSize / 2; // this is kind of stupid

  // Initialize context
  useEffect(() => {
    if (globalObject) {
      editorCtx.updateGlobalObjectSettings({
        x: globalObject.x,
        y: globalObject.y,
        url: globalObject.thumbUrl,
        name: globalObject.title,
      });
      // 20250107 Issue: This will break on small computers due to lack of cw/ch
      // Doesn't matter for alpha as it breaks anyway on small computers
      setIconBounds({
        left: globalObject.x - thumbRadius,
        right: globalObject.x + thumbRadius,
        top: globalObject.y - thumbRadius,
        bottom: globalObject.y + thumbRadius,
      });
    } else {
      const objectInitializer = {
        x: 100,
        y: 100,
        url: "objects/icons/dummy.svg",
        name: "dummy",
      };
      editorCtx.updateGlobalObjectSettings({
        x: objectInitializer.x,
        y: objectInitializer.y,
        url: objectInitializer.url,
        name: objectInitializer.name,
      });
      setIconBounds({
        left: objectInitializer.x - thumbRadius,
        right: objectInitializer.x + thumbRadius,
        top: objectInitializer.y - thumbRadius,
        bottom: objectInitializer.y + thumbRadius,
      });
    }
  }, []);

  // Editor actions
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Canvas values
    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;
    const rect = canvas.getBoundingClientRect();

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get editor context global object settings (gos)
    const gos = editorCtx.globalObjectSettings;

    // Keyboard events
    const keyboardHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "e") {
        setIsEditing(false);
        return;
      }
    };

    // Mouse events
    const mouseDownHandler = (e: MouseEvent) => {
      const mouseX = e.clientX - rect.x;
      const mouseY = e.clientY - rect.y;

      setIconBounds({
        left: gos.x * cw - thumbRadius,
        right: gos.x * cw + thumbRadius,
        top: gos.y * ch - thumbRadius,
        bottom: gos.y * ch + thumbRadius,
      });

      if (isEditing) {
        // Update position while in edit mode
        gos.x = mouseX / cw;
        gos.y = mouseY / ch;

        editorCtx.updateGlobalObjectSettings({
          name: gos.name,
          url: gos.url,
          x: gos.x,
          y: gos.y,
        });

        const newBounds = {
          left: mouseX - thumbRadius,
          right: mouseX + thumbRadius,
          top: mouseY - thumbRadius,
          bottom: mouseY + thumbRadius,
        };

        setIconBounds(newBounds);
      } else if (iconBounds) {
        // Check if clicking on the icon
        const isInsideIcon =
          mouseX > iconBounds.left &&
          mouseX < iconBounds.right &&
          mouseY > iconBounds.top &&
          mouseY < iconBounds.bottom;

        setIsEditing(isInsideIcon);
      }
    };

    // Mouse actions
    canvas.addEventListener("mousedown", mouseDownHandler);
    if (iconBounds) {
      redrawCanvas(canvas, isEditing, gos, thumbSize, iconBounds);
    }

    // Keyboard actions
    window.addEventListener("keydown", keyboardHandler);

    return () => {
      window.removeEventListener("keydown", keyboardHandler);
      canvas.removeEventListener("mousedown", mouseDownHandler);
    };
  }, [editorCtx, isEditing, iconBounds, thumbSize]);

  return { canvasRef };
}

export function redrawCanvas(
  canvas: HTMLCanvasElement,
  isEditing: Boolean,
  globalObject: GlobalObjectType,
  thumbSize: number,
  iconBounds: IconBounds
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const cw = canvas.width / 1000;
  const ch = canvas.height / 1000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawIcon(thumbSize, ctx, globalObject, cw, ch);
  if (isEditing && iconBounds) {
    drawEditMarker(ctx, iconBounds);
  }
}

export function drawIcon(
  thumbSize: number,
  ctx: CanvasRenderingContext2D,
  globalObject: GlobalObjectType,
  cw: number,
  ch: number
) {
  const icon = new Image();
  const thumbDiamater = thumbSize / 2;

  icon.onerror = (e) => {
    console.error("Error loading icon:", e);
  };

  icon.src = `/${globalObject.url}`;
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

export function drawEditMarker(
  ctx: CanvasRenderingContext2D,
  icon: IconBounds
) {
  ctx.strokeStyle = "pink";
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(icon.left - 5, icon.top - 5);
  ctx.lineTo(icon.right + 5, icon.top - 5);
  ctx.lineTo(icon.right + 5, icon.bottom + 5);
  ctx.lineTo(icon.left - 5, icon.bottom + 5);
  ctx.closePath();
  ctx.stroke();
}
