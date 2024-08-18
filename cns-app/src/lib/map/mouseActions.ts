import { drawMetaAreas, drawMetaObjects } from "./drawMetaAreas";

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

  const hoverArea: ClickStatus[] = [];

  // Return if no context
  if (!ctx) return;

  // Clear the canvas and redraw shapes
  mapAreas?.forEach((areaSet: GlobalAreaType) => {
    drawMetaAreas(ctx, areaSet, cw, ch);
    // Interactivity;
    if (ctx.isPointInPath(mouseX, mouseY)) {
      hoverArea.push({
        id: areaSet.id,
        title: areaSet.title,
        type: "GlobalAreaType",
      });
    }
  });
  return hoverArea;
}

export function checkClick(
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

  const clickedArea: ClickStatus[] = [];

  // Return if no context
  if (!ctx) return;

  // Clear the canvas and redraw shapes
  mapAreas?.forEach((areaSet: GlobalAreaType) => {
    drawMetaAreas(ctx, areaSet, cw, ch);
    if (ctx.isPointInPath(mouseX, mouseY)) {
      clickedArea.push({
        id: areaSet.id,
        title: areaSet.title,
        type: "GlobalAreaType",
      });
    }
  });
  return clickedArea;
}

export function checkObjectClick(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  mapObjects: GlobalAreaType[],
  ctx: CanvasRenderingContext2D | null,
  cw: number,
  ch: number
) {
  const r = canvas.getBoundingClientRect();
  const mouseX = event.clientX - r.x;
  const mouseY = event.clientY - r.y;

  const clickedObject: ClickStatus[] = [];

  // Return if no context
  if (!ctx) return;

  // Clear the canvas and redraw shapes
  mapObjects?.forEach((objectSet: GlobalAreaType) => {
    drawMetaObjects(ctx, objectSet, cw, ch);
    if (ctx.isPointInPath(mouseX, mouseY)) {
      clickedObject.push({
        id: objectSet.id,
        title: objectSet.title,
        type: "GlobalObjectType",
      });
    }
  });
  return clickedObject;
}
