import { getValueFirstOfEachStyleType } from "../utils";
import { drawRectangularMetaArea } from "./drawMetaAreas";

export function drawAreas(
  ctx: CanvasRenderingContext2D,
  node: DrawMapArea,
  cw: number,
  ch: number
) {
  const points = node.nodes;
  ctx.beginPath();
  ctx.moveTo(points[0].x * cw, points[0].y * ch);
  for (var i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x * cw, points[i].y * ch);
  }
  // ctx.lineTo(points[0].x * cw, points[0].y * ch);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

export function drawMasterMapArea(
  ctx: CanvasRenderingContext2D,
  map: any,
  styles: any,
  cw: number,
  ch: number
) {
  const fillStyle = styles.fillStyle || "rgba(256, 256, 256, 0.2)";
  const strokeStyle = styles.strokeStyle || "#ffffff";
  const lineWidth = parseInt(styles.lineWidth) || 4;
  const fontSize = parseInt(styles.fontSize) || 16;
  const fontColor = styles.fontColor || "#ffffff";
  const fontType = styles.fontType || "mono";
  const title = map.title || map.mapTitle || "";

  ctx.lineWidth = lineWidth;
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  drawRectangularMetaArea(ctx, map, cw, ch);
  ctx.font = `${fontSize}px ${fontType}`;
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = fontColor;
  ctx.fillText(
    title,
    map.x * cw + lineWidth,
    (map.y + map.wy) * ch - lineWidth
  );
}
