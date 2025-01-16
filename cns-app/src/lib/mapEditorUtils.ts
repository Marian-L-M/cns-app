interface areaNode {
  id: number;
  x: number;
  y: number;
}

export const draw = (
  ctx: CanvasRenderingContext2D,
  area: areaNode[],
  cw: number,
  ch: number
) => {
  // current drawArea function is nonsensical (nested nodes structure used in mapmaker -> Find better way to unify)
  ctx.beginPath();
  ctx.moveTo(area[0].x * cw, area[0].y * ch);
  for (var i = 1; i < area.length; i++) {
    ctx.lineTo(area[i].x * cw, area[i].y * ch);
  }
  ctx.lineTo(area[0].x * cw, area[0].y * ch);
  ctx.closePath;
  ctx.stroke();
  ctx.fill();
};

export const drawEditNodes = (
  ctx: CanvasRenderingContext2D,
  area: areaNode[],
  cw: number,
  ch: number,
  activeNode?: number | null
) => {
  const offset = 10;
  area.forEach((node, index) => {
    ctx.beginPath();
    if (index === activeNode) {
      ctx.fillStyle = "black";
    } else {
      ctx.fillStyle = "white";
    }
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.moveTo(node.x * cw - offset, node.y * ch - offset);
    ctx.lineTo(node.x * cw + offset, node.y * ch - offset);
    ctx.lineTo(node.x * cw + offset, node.y * ch + offset);
    ctx.lineTo(node.x * cw - offset, node.y * ch + offset);
    ctx.lineTo(node.x * cw - offset, node.y * ch - offset);
    ctx.closePath;
    ctx.stroke();
    ctx.fill();
  });
};

export const drawMetaNode = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cw: number,
  ch: number
) => {
  const offset = 10;
  ctx.beginPath();
  ctx.moveTo(x * cw - offset, y * ch - offset);
  ctx.lineTo(x * cw + offset, y * ch - offset);
  ctx.lineTo(x * cw + offset, y * ch + offset);
  ctx.lineTo(x * cw - offset, y * ch + offset);
  ctx.lineTo(x * cw - offset, y * ch - offset);
  ctx.closePath;
};
