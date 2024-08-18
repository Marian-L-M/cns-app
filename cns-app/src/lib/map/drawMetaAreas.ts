export function drawMetaAreas(
  ctx: CanvasRenderingContext2D,
  area: DrawMapArea,
  cw: number,
  ch: number
) {
  const points = area.nodes;
  ctx.beginPath();
  ctx.moveTo(points[0].x * cw, points[0].y * ch);
  for (var i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x * cw, points[i].y * ch);
  }
  ctx.lineTo(points[0].x * cw, points[0].y * ch);
}

export function drawMetaObjects(
  ctx: CanvasRenderingContext2D,
  object: DrawMapObject,
  cw: number,
  ch: number
) {
  ctx.beginPath();
  ctx.moveTo((object.x - 20) * cw, (object.y - 20) * ch);
  ctx.lineTo((object.x + 20) * cw, (object.y - 20) * ch);
  ctx.lineTo((object.x + 20) * cw, (object.y + 20) * ch);
  ctx.lineTo((object.x - 20) * cw, (object.y + 20) * ch);
  ctx.closePath();
}
