import { drawMetaNode } from "./draw/drawStory";
import {
  drawMetaAreas,
  drawMetaObjects,
  drawRectangularMetaArea,
} from "./map/drawMetaAreas";
import { CanvasStyleItem, Map } from "@prisma/client";
interface MapWithRectangularArea extends Map, PointRectangularArea {}

interface hitArea {
  id: number;
  title: string;
}

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

export function checkHitbox(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  areaList: MapWithRectangularArea[],
  ctx: CanvasRenderingContext2D | null,
  cw: number,
  ch: number
) {
  const r = canvas.getBoundingClientRect();
  const mouseX = event.clientX - r.x;
  const mouseY = event.clientY - r.y;

  const hitArea: hitArea[] = [];

  // Return if no context
  if (!ctx) return;

  areaList?.forEach((area) => {
    drawRectangularMetaArea(ctx, area, cw, ch);
    if (ctx.isPointInPath(mouseX, mouseY)) {
      hitArea.push({
        id: area.id,
        title: area.title,
      });
    }
  });
  return hitArea;
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
  mapObjects: GlobalObjectType[],
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
  mapObjects?.forEach((objectSet: GlobalObjectType) => {
    // Get icon size
    const iconStyle = objectSet.canvasStyles.find(
      (item: CanvasStyleItem) => item.type === "size"
    );
    const iconWidth = parseInt(iconStyle?.value) | 40;

    drawMetaObjects(ctx, objectSet, cw, ch, iconWidth);
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

// 240822 Memo: Click triggered story nodes can actually go above images
export function checkStoryNodeClick(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  story: GlobalStoryType[],
  ctx: CanvasRenderingContext2D | null,
  cw: number,
  ch: number
) {
  const r = canvas.getBoundingClientRect();
  const mouseX = event.clientX - r.x;
  const mouseY = event.clientY - r.y;

  const clickedStoryNode: StoryClickStatus[] = [];

  // Return if no context
  if (!ctx) return;

  // Clear the canvas and redraw shapes
  story.forEach((mapNodes) => {
    mapNodes.nodes.forEach((nodeSet: GlobalStoryType) => {
      drawMetaNode(ctx, nodeSet, cw, ch);
      if (ctx.isPointInPath(mouseX, mouseY)) {
        clickedStoryNode.push({
          id: nodeSet.id,
          title: nodeSet.name,
          description: nodeSet.description,
          type: "StoryNode",
        });
      }
    });
  });
  return clickedStoryNode;
}
