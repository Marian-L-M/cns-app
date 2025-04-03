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
  hitPoint: { x: number; y: number; size: number; name: string },
  ctx: CanvasRenderingContext2D,
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
  hitPoint: { x: number; y: number; size: number; name: string },
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number
) {
  const offset = hitPoint.size / 2;
  const padding = 1;
  const serif = 5;
  const pointTl = {
    x: hitPoint.x - offset + padding,
    y: hitPoint.y - offset + padding,
  };
  const pointTr = {
    x: hitPoint.x + offset - padding,
    y: hitPoint.y - offset + padding,
  };
  const pointBl = {
    x: hitPoint.x - offset + padding,
    y: hitPoint.y + offset - padding,
  };
  const pointBr = {
    x: hitPoint.x + offset - padding,
    y: hitPoint.y + offset - padding,
  };
  drawSerifLine(pointTl, pointBr, serif, ctx, cw, ch);
  drawSerifLine(pointBl, pointTr, serif, ctx, cw, ch);
}

export function drawSizeMarker(
  hitPoint: { x: number; y: number; size: number; name: string },
  isFallingLine: boolean,
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number
) {
  const offset = hitPoint.size / 2;
  const padding = 1;
  const serif = 5;
  const direction = isFallingLine ? -1 : 1;

  const point1 = {
    x: hitPoint.x - offset + padding,
    y: hitPoint.y + offset * direction - padding * direction,
  };
  const point2 = {
    x: hitPoint.x + offset - padding,
    y: hitPoint.y - offset * direction + padding * direction,
  };

  drawSerifLine(point1, point2, serif, ctx, cw, ch);
}

interface coordinate {
  x: number;
  y: number;
}

// Enter coordinate points from left to right
export function drawSerifLine(
  point1: coordinate,
  point2: coordinate,
  serif: number,
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number
) {
  ctx.strokeStyle = "black";
  // Line going from high to low
  if (point1.y < point2.y) {
    // Tl serif
    ctx.beginPath();
    ctx.moveTo(point1.x * cw, (point1.y + serif) * ch);
    ctx.lineTo(point1.x * cw, point1.y * ch);
    ctx.lineTo((point1.x + serif) * cw, point1.y * ch);
    ctx.stroke();
    // TL-BR bar
    ctx.beginPath();
    ctx.moveTo(point1.x * cw, point1.y * ch);
    ctx.lineTo(point2.x * cw, point2.y * ch);
    ctx.stroke();
    // BR serif
    ctx.beginPath();
    ctx.moveTo((point2.x - serif) * cw, point2.y * ch);
    ctx.lineTo(point2.x * cw, point2.y * ch);
    ctx.lineTo(point2.x * cw, (point2.y - serif) * ch);
    ctx.stroke();
  }
  if (point1.y > point2.y) {
    // TR serif
    ctx.beginPath();
    ctx.moveTo((point2.x - serif) * cw, point2.y * ch);
    ctx.lineTo(point2.x * cw, point2.y * ch);
    ctx.lineTo(point2.x * cw, (point2.y + serif) * ch);
    ctx.stroke();
    // TR-BL bar
    ctx.beginPath();
    ctx.moveTo(point2.x * cw, point2.y * ch);
    ctx.lineTo(point1.x * cw, point1.y * ch);
    ctx.stroke();
    // Bl serif
    ctx.beginPath();
    ctx.moveTo(point1.x * cw, (point1.y - serif) * ch);
    ctx.lineTo(point1.x * cw, point1.y * ch);
    ctx.lineTo((point1.x + serif) * cw, point1.y * ch);
    ctx.stroke();
  }
  ctx.fillStyle = "none";
  ctx.strokeStyle = "none";
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
