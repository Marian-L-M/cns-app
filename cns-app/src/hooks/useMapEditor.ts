import { useContext, useEffect, useRef, useState } from "react";
import { draw, drawEditNodes, drawMetaNode } from "@/lib/mapEditorUtils";
import { EditorContext } from "@/store/mapEditorContext";
import { mapObjectDefaultIcon } from "@/lib/constants/objectIcons";
import {
  getValueFirstOfEachObjectType,
  getValueFirstOfEachStyleType,
} from "@/lib/utils";

interface IconBounds {
  left: number;
  right: number;
  bottom: number;
  top: number;
}

export function useMapEditor() {
  const canvasRef = useRef(null);
  return { canvasRef };
}

export function useMapAreaEditor({ globalArea }: any = {}) {
  const { canvasRef } = useAreaEditor(globalArea);
  return { canvasRef };
}

export function useMapObjectEditor({ globalObject }: any = {}) {
  const { canvasRef } = useObjectEditor(globalObject);
  return { canvasRef };
}

export function useAreaEditor(globalArea: any) {
  const editorCtx = useContext(EditorContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [isActiveFlag, setIsActiveFlag] = useState(false);

  // Style settings
  const styles = getValueFirstOfEachStyleType(globalArea?.canvasStyles);
  const lineWidth = parseInt(styles.lineWidth) || 2;
  const fillStyle = styles.fillStyle || "grey";
  const strokeStyle = styles.strokeStyle || "black";
  const nodes = globalArea?.nodes;

  //   // Initialize context
  useEffect(() => {
    if (!nodes) return;
    editorCtx.updateNodeList(nodes);

    editorCtx.pickObjectColor(fillStyle);

    editorCtx.pickLineColor(strokeStyle);

    editorCtx.pickLineWidth(lineWidth);
  }, [styles]);

  // Draw logic
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
        drawEditNodes(ctx, editorCtx.nodeList, cw, ch, activeNode, 5);
      }
    };

    // Keyboar shortcuts
    const keyboardHandler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "e") {
        setIsActiveFlag(false);
        setActiveNode(null);
        redrawCanvas();
        return;
      } else if (e.key === "Backspace" || e.key === "r") {
        if (!activeNode) return;
        removeNodeFromContext(editorCtx, activeNode);
        setIsActiveFlag(false);
        setActiveNode(null);
        redrawCanvas();
        return;
      }
    };

    // Initial draw
    redrawCanvas();

    // 250116 Todo: Add fix broken exit editor node functionality (Enter needs to be pressed twice)
    // Draw new ares on click
    canvas.onmousedown = (e) => {
      const mouseX = e.clientX - r.x;
      const mouseY = e.clientY - r.y;
      let updatedNodes = [...editorCtx.nodeList];
      let nodeClicked = false;

      // Check for existing nodes
      updatedNodes.forEach((node: areaNode, index) => {
        drawMetaNode(ctx, node.x, node.y, cw, ch);
        if (ctx.isPointInPath(mouseX, mouseY)) {
          nodeClicked = true;
          setIsActiveFlag(true);
          setActiveNode(index);
          return;
        }
      });

      // Split into two loops to prevent stacking order issue when switching editing nodes
      updatedNodes.forEach((node: areaNode, index) => {
        if (isActiveFlag && activeNode === index && !nodeClicked) {
          updatedNodes[index].x = mouseX;
          updatedNodes[index].y = mouseY;
          return;
        }
      });

      // Add node if not editing or clicking on existing node
      if (!nodeClicked && !isActiveFlag) {
        updatedNodes.push({ id: idCounter++, x: mouseX, y: mouseY });
      }

      // Update context with any changes
      editorCtx.updateNodeList(updatedNodes);
      redrawCanvas();
    };

    // // Keyboard actions
    window.addEventListener("keydown", keyboardHandler);
    // Cleanup
    return () => {
      canvas.onmousedown = null;
    };
  }, [editorCtx, activeNode]);
  return { canvasRef };
}

export function useObjectEditor(globalObject: any) {
  const editorCtx = useContext(EditorContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [iconBounds, setIconBounds] = useState<IconBounds | null>(null);

  // Style settings
  const styles = getValueFirstOfEachObjectType(globalObject?.canvasStyles);
  const thumbSize = parseInt(styles.size) || 40;
  const thumbRadius = thumbSize / 2;
  const opacity = parseInt(styles.opacity) / 100;

  useEffect(() => {
    if (globalObject) {
      editorCtx.updateGlobalObjectSettings({
        x: globalObject.x,
        y: globalObject.y,
        url: globalObject.iconUrl,
        name: globalObject.title,
        size: thumbSize || 40,
        opacity: opacity || 100,
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
        url: mapObjectDefaultIcon.url,
        name: "dummy",
        size: thumbSize | 40,
        opacity: opacity | 100,
      };
      editorCtx.updateGlobalObjectSettings({
        x: objectInitializer.x,
        y: objectInitializer.y,
        url: objectInitializer.url,
        name: objectInitializer.name,
        size: thumbSize | 40,
        opacity: opacity | 100,
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
          size: thumbSize || 40,
          opacity: opacity || 100,
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
      redrawCanvas(canvas, isEditing, gos, thumbSize, opacity, iconBounds);
    }

    // Keyboard actions
    window.addEventListener("keydown", keyboardHandler);

    return () => {
      window.removeEventListener("keydown", keyboardHandler);
      canvas.removeEventListener("mousedown", mouseDownHandler);
    };
  }, [editorCtx, isEditing, iconBounds]);

  return { canvasRef };
}

export function redrawCanvas(
  canvas: HTMLCanvasElement,
  isEditing: Boolean,
  globalObject: GlobalObjectType,
  thumbSize: number,
  opacity: number,
  iconBounds: IconBounds
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const cw = canvas.width / 1000;
  const ch = canvas.height / 1000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawIcon(thumbSize, opacity, ctx, globalObject, cw, ch);
  if (isEditing && iconBounds) {
    drawEditMarker(ctx, iconBounds);
  }
}

export function drawIcon(
  thumbSize: number,
  opacity: number,
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

  icon.src = globalObject.url || mapObjectDefaultIcon.url;
  icon.onload = () => {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.drawImage(
      icon,
      globalObject.x * cw - thumbDiamater,
      globalObject.y * ch - thumbDiamater,
      thumbSize,
      thumbSize
    );
    ctx.restore();
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

export function removeNodeFromContext(editorCtx: any, index: number) {
  let updatedNodes = [...editorCtx.nodeList];
  const filteredNodes = updatedNodes.filter((_, i) => i !== index);
  editorCtx.updateNodeList(filteredNodes);

  return;
}
