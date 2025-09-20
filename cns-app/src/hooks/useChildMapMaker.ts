import { useEffect, useRef, useState } from "react";
import { CanvasStyleItem, Map } from "@prisma/client";

import {
  drawPointFixedMetaSquare,
  drawPositionMarker,
  drawRectangularMetaArea,
  drawSizeMarker,
} from "@/lib/map/drawMetaAreas";
import { getValueFirstOfEachStyleType } from "@/lib/utils";
import { drawMasterMapArea } from "@/lib/map/drawMap";

interface ChildMapEditable extends PointRectangularArea {
  mapTitle: string;
  canvasStyles: CanvasStyleItem[];
}

interface ChildMapEditorHookProps {
  childMapEditorItem: ChildMapEditable;
  setChildMapEditorItem: React.Dispatch<React.SetStateAction<ChildMapEditable>>;
}

export function useChildMapMaker({
  childMapEditorItem,
  setChildMapEditorItem,
}: ChildMapEditorHookProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editorState, setEditorState] = useState("");

  // Style settings
  const styles = getValueFirstOfEachStyleType(childMapEditorItem.canvasStyles);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Canvas values
    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set Canvas
    const canvasResult = redrawCanvas(
      canvas,
      ctx,
      cw,
      ch,
      childMapEditorItem,
      styles,
      editorState
    );

    // Early return if redrawCanvas returned undefined
    if (!canvasResult) return;

    const { positionToggle, sizeToggle } = canvasResult;

    // Keyboard actions
    function keyboardHandler(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === "e") {
        // setActiveSubstoryID(undefined);
        setEditorState("");
        return;
      }
    }
    window.addEventListener("keydown", keyboardHandler);

    canvas.onmousedown = (e) => {
      // Click events
      checkToggleHit(e, canvas, ctx, positionToggle, setEditorState, cw, ch);
      checkToggleHit(e, canvas, ctx, sizeToggle, setEditorState, cw, ch);

      // Cleanup
      return () => {
        canvas.onmousedown = null;
      };
    };

    // Mouse move events
    canvas.onmousemove = (e) => {
      const r = canvas.getBoundingClientRect();
      const mouseX = e.x - r.x;
      const mouseY = e.y - r.y;
      const diffXNormalized = mouseX / cw - childMapEditorItem.x;
      const diffYNormalized = mouseY / ch - childMapEditorItem.y;

      // Limit rectangle size to canvas bounds
      const boundedWxFromPosition = checkUpperBounds(
        mouseX,
        childMapEditorItem.wx
      );
      const boundedWyFromPosition = checkUpperBounds(
        mouseY,
        childMapEditorItem.wy
      );
      const boundedWxFromSize = checkUpperBounds(
        childMapEditorItem.x,
        diffXNormalized
      );
      const boundedWyFromSize = checkUpperBounds(
        childMapEditorItem.y,
        diffYNormalized
      );

      switch (editorState) {
        case "POSITION":
          setChildMapEditorItem({
            x: mouseX,
            y: mouseY,
            wx: boundedWxFromPosition,
            wy: boundedWyFromPosition,
            mapTitle: childMapEditorItem.mapTitle,
            canvasStyles: childMapEditorItem.canvasStyles,
          });
          break;
        case "SIZE":
          setChildMapEditorItem({
            x: childMapEditorItem.x,
            y: childMapEditorItem.y,
            wx: boundedWxFromSize,
            wy: boundedWyFromSize,
            mapTitle: childMapEditorItem.mapTitle,
            canvasStyles: childMapEditorItem.canvasStyles,
          });
          break;
        default:
          return;
      }
    };
  }, [childMapEditorItem, editorState, childMapEditorItem.canvasStyles]);

  return { canvasRef };
}

function redrawCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  childMapEditorItem: ChildMapEditable,
  styles: any,
  editorState: string
) {
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw initial areas
  if (!childMapEditorItem) return;

  drawMasterMapArea(ctx, childMapEditorItem, styles, cw, ch);

  // Draw Placement indicator
  const positionToggle = {
    x: childMapEditorItem.x,
    y: childMapEditorItem.y,
    size: 20,
    name: "POSITION",
  };
  // Draw Box
  ctx.lineWidth = 1;
  ctx.fillStyle = editorState == "POSITION" ? "yellow" : "white";
  drawPointFixedMetaSquare(positionToggle, ctx, cw, ch);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "none";
  ctx.strokeStyle = "white";

  // Draw Symbol
  drawPositionMarker(positionToggle, ctx, cw, ch);

  // 250403 To do: Border stroke is leaking through

  // Draw size indicator
  const sizeToggle = {
    x: childMapEditorItem.x + childMapEditorItem.wx,
    y: childMapEditorItem.y + childMapEditorItem.wy,
    size: 20,
    name: "SIZE",
  };
  ctx.lineWidth = 1;
  ctx.fillStyle = editorState == "SIZE" ? "yellow" : "white";
  drawPointFixedMetaSquare(sizeToggle, ctx, cw, ch);
  ctx.fillStyle = "none";
  ctx.strokeStyle = "white";
  ctx.fill();
  ctx.stroke();

  // Draw Symbol
  drawSizeMarker(sizeToggle, true, ctx, cw, ch);

  return { positionToggle, sizeToggle };
}

function checkToggleHit(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D | null,
  hitPoint: { x: number; y: number; size: number; name: string },
  setEditorState: React.Dispatch<React.SetStateAction<string>>,
  cw: number,
  ch: number
) {
  const r = canvas.getBoundingClientRect();
  const mouseX = event.clientX - r.x;
  const mouseY = event.clientY - r.y;

  // Return if no context
  if (!ctx) return;
  drawPointFixedMetaSquare(hitPoint, ctx, cw, ch);

  if (ctx.isPointInPath(mouseX, mouseY)) {
    setEditorState(hitPoint.name);
  }
}

// Check sum of point and extension vs fixed coordinate width of 1000
function checkUpperBounds(point: number, extension: number) {
  let NewExtension = extension;

  if (point + extension >= 1000) {
    NewExtension = 1000 - point;
  }
  return NewExtension <= 0 ? 0 : NewExtension;
}
