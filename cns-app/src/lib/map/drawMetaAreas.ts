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
  ctx.closePath();
}

// Draw a map that uses x,y,wx,wy
export function drawRectangularMetaArea(
  ctx: CanvasRenderingContext2D,
  area: PointRectangularArea,
  cw: number,
  ch: number
) {
  ctx.beginPath();
  ctx.moveTo(area.x * cw, area.y * ch);
  ctx.lineTo((area.x + area.wx) * cw, area.y * ch);
  ctx.lineTo((area.x + area.wx) * cw, (area.y + area.wy) * ch);
  ctx.lineTo(area.x * cw, (area.y + area.wy) * ch);
  ctx.lineTo(area.x * cw, area.y * ch);
  ctx.closePath();
}

export function drawPointFixedMetaSquare(
  ctx: CanvasRenderingContext2D,
  hitPoint: { x: number; y: number; size: number; name: string },
  cw: number,
  ch: number
) {
  const offset = hitPoint.size / 2;

  ctx.beginPath();
  ctx.moveTo((hitPoint.x - offset) * cw, (hitPoint.y - offset) * ch);
  ctx.lineTo((hitPoint.x + offset) * cw, (hitPoint.y - offset) * ch);
  ctx.lineTo((hitPoint.x + offset) * cw, (hitPoint.y + offset) * ch);
  ctx.lineTo((hitPoint.x - offset) * cw, (hitPoint.y + offset) * ch);
  ctx.lineTo((hitPoint.x - offset) * cw, (hitPoint.y - offset) * ch);
  ctx.closePath();
}

export function drawPositionMarker(
  ctx: CanvasRenderingContext2D,
  hitPoint: { x: number; y: number; size: number; name: string },
  cw: number,
  ch: number
) {
  const offset = hitPoint.size / 2;
  const padding = 1;

  ctx.beginPath();
  // TL-BR bar
  ctx.moveTo(
    (hitPoint.x - offset + padding) * cw,
    (hitPoint.y - offset + padding) * ch
  );
  ctx.lineTo(
    (hitPoint.x + offset - padding) * cw,
    (hitPoint.y + offset - padding) * ch
  );
  // TR-BL bar
  ctx.moveTo(
    (hitPoint.x + offset - padding) * cw,
    (hitPoint.y - offset + padding) * ch
  );
  ctx.lineTo(
    (hitPoint.x - offset + padding) * cw,
    (hitPoint.y + offset - padding) * ch
  );
  // 250402 To do -> Add serifs to position marker
  // ctx.lineTo((hitPoint.x + offset) * cw, (hitPoint.y + offset) * ch);
  // ctx.lineTo((hitPoint.x - offset) * cw, (hitPoint.y + offset) * ch);
  // ctx.lineTo((hitPoint.x - offset) * cw, (hitPoint.y - offset) * ch);
  ctx.closePath();
}

// Object should be rectangular meta areas
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

export function drawMetaStoryNodes(
  ctx: CanvasRenderingContext2D,
  object: DrawMapObject,
  cw: number,
  ch: number
) {
  // console.log(object);
  ctx.beginPath();
  ctx.moveTo((object.x - 5) * cw, (object.y - 5) * ch);
  ctx.lineTo((object.x + 5) * cw, (object.y - 5) * ch);
  ctx.lineTo((object.x + 5) * cw, (object.y + 5) * ch);
  ctx.lineTo((object.x - 5) * cw, (object.y + 5) * ch);
  ctx.closePath();
}
