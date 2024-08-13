import { useContext } from "react";
import StatusContext from "@/store/statusContext";

import { drawMetaAreas } from "./drawMetaAreas";

export function checkHover(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  mapAreas: GlobalAreaType[],
  ctx: CanvasRenderingContext2D | null,
  cw: number,
  ch: number
) {
  const r = canvas.getBoundingClientRect();
  const mouseX = event.clientX - r.x;
  const mouseY = event.clientY - r.y;

  // Return if no context
  if (!ctx) return;

  // Clear the canvas and redraw shapes
  mapAreas?.forEach((areaSet: GlobalAreaType) => {
    areaSet.nodes.forEach((area: DrawMapArea) => {
      drawMetaAreas(ctx, area, cw, ch, mouseX, mouseY);
      // Interactivity;
      if (ctx.isPointInPath(mouseX, mouseY)) {
        console.log("hovering over: ", area.name);
      }
    });
  });
}

export function checkClick(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  mapAreas: GlobalAreaType[],
  ctx: CanvasRenderingContext2D | null,
  cw: number,
  ch: number
  // statusBarHandler: (statusMessage: string) => void
) {
  const r = canvas.getBoundingClientRect();
  const mouseX = event.clientX - r.x;
  const mouseY = event.clientY - r.y;

  const clickedArea: MapStatus[] = [];

  // Return if no context
  if (!ctx) return;

  // Clear the canvas and redraw shapes
  mapAreas?.forEach((areaSet: GlobalAreaType) => {
    areaSet.nodes.forEach((area: DrawMapArea) => {
      drawMetaAreas(ctx, area, cw, ch, mouseX, mouseY);
      if (ctx.isPointInPath(mouseX, mouseY)) {
        clickedArea.push({
          id: area.id,
          name: area.name,
        });
      }
    });
  });
  return clickedArea;
}
