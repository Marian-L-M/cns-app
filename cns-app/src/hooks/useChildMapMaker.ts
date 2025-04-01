import { useEffect, useRef, useState } from "react";
import { Map } from "@prisma/client";

import {
  drawPointFixedMetaSquare,
  drawRectangularMetaArea,
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
      const r = canvas.getBoundingClientRect();
      const mouseX = e.clientX - r.x;
      const mouseY = e.clientY - r.y;

      switch (editorState) {
        case "POSITION":
          setChildMapCoordinates({
            x: mouseX,
            y: mouseY,
            wx: childMapCoordinates.wx,
            wy: childMapCoordinates.wy,
            mapTitle: childMapCoordinates.mapTitle,
          });
          break;
        case "SIZE":
          console.log("Resize mode go!");
          break;
        default:
          checkToggleHit(
            e,
            canvas,
            ctx,
            positionToggle,
            setEditorState,
            cw,
            ch
          );
          checkToggleHit(e, canvas, ctx, sizeToggle, setEditorState, cw, ch);
      }

      // Cleanup
      return () => {
        canvas.onmousedown = null;
      };
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
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.fillStyle = editorState == "POSITION" ? "red" : "white";
  drawPointFixedMetaSquare(ctx, positionToggle, cw, ch);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "none";
  ctx.strokeStyle = "none";

  // Draw size indicator
  const sizeToggle = {
    x: childMapCoordinates.x + childMapCoordinates.wx,
    y: childMapCoordinates.y + childMapCoordinates.wy,
    size: 20,
    name: "SIZE",
  };
  // ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.fillStyle = editorState == "SIZE" ? "red" : "black";
  drawPointFixedMetaSquare(ctx, sizeToggle, cw, ch);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "none";
  ctx.strokeStyle = "none";

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

function keyboardHandler(
  e: KeyboardEvent,
  setEditorState: React.Dispatch<React.SetStateAction<string>>
) {
  if (e.key === "Enter" || e.key === "e") {
    // setActiveSubstoryID(undefined);
    setEditorState("");
    return;
  }
}
