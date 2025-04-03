import { useEffect, useRef, useState } from "react";
import { Map } from "@prisma/client";

import {
  drawPointFixedMetaSquare,
  drawPositionMarker,
  drawRectangularMetaArea,
  drawSizeMarker,
} from "@/lib/map/drawMetaAreas";

interface MapWithRectangularArea
  extends HierarchyConnection,
    Map,
    PointRectangularArea {}

interface ChildMapEditable extends PointRectangularArea {
  mapTitle: string;
}

interface ChildMapEditorHookProps {
  childMapCoordinates: ChildMapEditable;
  setChildMapCoordinates: React.Dispatch<
    React.SetStateAction<ChildMapEditable>
  >;
}

export const useChildMapMaker = ({
  childMapCoordinates,
  setChildMapCoordinates,
}: ChildMapEditorHookProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editorState, setEditorState] = useState("");

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
    const { positionToggle, sizeToggle } = redrawCanvas(
      canvas,
      ctx,
      cw,
      ch,
      childMapCoordinates,
      editorState
    );

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
      const diffXNormalized = mouseX / cw - childMapCoordinates.x;
      const diffYNormalized = mouseY / ch - childMapCoordinates.y;

      // Limit rectangle size to canvas bounds
      const boundedWxFromPosition = checkUpperBounds(
        mouseX,
        childMapCoordinates.wx
      );
      const boundedWyFromPosition = checkUpperBounds(
        mouseY,
        childMapCoordinates.wy
      );
      const boundedWxFromSize = checkUpperBounds(
        childMapCoordinates.x,
        diffXNormalized
      );
      const boundedWyFromSize = checkUpperBounds(
        childMapCoordinates.y,
        diffYNormalized
      );

      switch (editorState) {
        case "POSITION":
          setChildMapCoordinates({
            x: mouseX,
            y: mouseY,
            wx: boundedWxFromPosition,
            wy: boundedWyFromPosition,
            mapTitle: childMapCoordinates.mapTitle,
          });
          break;
        case "SIZE":
          setChildMapCoordinates({
            x: childMapCoordinates.x,
            y: childMapCoordinates.y,
            wx: boundedWxFromSize,
            wy: boundedWyFromSize,
            mapTitle: childMapCoordinates.mapTitle,
          });
          break;
        default:
          return;
      }
    };
  }, [childMapCoordinates, editorState]);

  return { canvasRef };
};

function redrawCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  childMapCoordinates: ChildMapEditable,
  editorState: string
) {
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw initial areas
  if (!childMapCoordinates) return;

  ctx.lineWidth = 4;
  ctx.fillStyle = "rgba(256, 256, 256, 0.2)";
  ctx.strokeStyle = "white";
  drawRectangularMetaArea(ctx, childMapCoordinates, cw, ch);
  ctx.font = "16px mono";
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.fillText(
    childMapCoordinates.mapTitle,
    childMapCoordinates.x * cw + 4,
    (childMapCoordinates.y + childMapCoordinates.wy) * ch - 4
  );

  // Draw Placement indicator
  const positionToggle = {
    x: childMapCoordinates.x,
    y: childMapCoordinates.y,
    size: 20,
    name: "POSITION",
  };
  // Draw Box
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.fillStyle = editorState == "POSITION" ? "yellow" : "white";
  drawPointFixedMetaSquare(positionToggle, ctx, cw, ch);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "none";
  ctx.strokeStyle = "none";

  // Draw Symbol
  drawPositionMarker(positionToggle, ctx, cw, ch);

  // 250403 To do: Border stroke is leaking through

  // Draw size indicator
  const sizeToggle = {
    x: childMapCoordinates.x + childMapCoordinates.wx,
    y: childMapCoordinates.y + childMapCoordinates.wy,
    size: 20,
    name: "SIZE",
  };
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.fillStyle = editorState == "SIZE" ? "yellow" : "white";
  drawPointFixedMetaSquare(sizeToggle, ctx, cw, ch);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "none";
  ctx.strokeStyle = "none";

  // Draw Symbol
  drawSizeMarker(sizeToggle, false, ctx, cw, ch);

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
  drawPointFixedMetaSquare(ctx, hitPoint, cw, ch);

  if (ctx.isPointInPath(mouseX, mouseY)) {
    console.log(`hit ${hitPoint.name}`);
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
