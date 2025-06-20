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
