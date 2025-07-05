export function drawArrowLine(
  ctx: CanvasRenderingContext2D,
  storyObject: story,
  cw: number,
  ch: number
) {
  let previousNode: Point;

  storyObject.nodes.forEach((node: StoryNode) => {
    // Draw Story Line
    if (previousNode) {
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.moveTo(previousNode.x * cw, previousNode.y * ch);
      ctx.lineTo(node.x * cw, node.y * ch);
      ctx.closePath();
      ctx.stroke();

      // Triangle size
      const triangleSize = 12;

      // Define triangle points (pointing right initially)
      const trianglePoints = [
        { x: triangleSize, y: 0 },
        { x: -triangleSize / 2, y: -triangleSize / 2 },
        { x: -triangleSize / 2, y: triangleSize / 2 },
      ];

      // Draw rotated triangle
      const diffX = node.x - previousNode.x;
      const diffY = node.y - previousNode.y;
      const centerX = ((previousNode.x + node.x) / 2) * cw;
      const centerY = ((previousNode.y + node.y) / 2) * ch;
      const angle = Math.atan2(diffY, diffX); // Angle between diff point and origin

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle); // Rotate canvas to match angle of diff point

      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";
      ctx.lineWidth = 2;

      ctx.moveTo(trianglePoints[0].x, trianglePoints[0].y);
      trianglePoints.slice(1).forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();

      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }
    previousNode = { x: node.x, y: node.y };
  });
}

export function drawStoryNode(
  ctx: CanvasRenderingContext2D,
  node: StoryNode,
  cw: number,
  ch: number,
  activeSubstoryID?: number
) {
  if (activeSubstoryID === node.id) {
    drawNodeSquare(ctx, node.x, node.y, cw, ch, 10, "yellow", "black");
    drawNodeSquare(ctx, node.x, node.y, cw, ch, 5, "blue", "none");
  } else {
    drawNodeSquare(ctx, node.x, node.y, cw, ch, 5, "red", "black");
  }
}

// Unify with useMapEditor drawmeta node)
export function drawMetaNode(
  ctx: CanvasRenderingContext2D,
  node: StoryNode,
  cw: number,
  ch: number
) {
  drawNodeSquare(ctx, node.x, node.y, cw, ch, 10, "unset", "unset");
}

export function drawNodeSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cw: number,
  ch: number,
  offset: number,
  fillStyle?: string,
  strokeStyle?: string
) {
  ctx.beginPath();
  ctx.lineWidth = 1;
  fillStyle ? (ctx.fillStyle = fillStyle) : (ctx.fillStyle = "none");
  strokeStyle ? (ctx.strokeStyle = strokeStyle) : (ctx.strokeStyle = "none");
  ctx.moveTo((x - offset) * cw, (y - offset) * ch);
  ctx.lineTo((x + offset) * cw, (y - offset) * ch);
  ctx.lineTo((x + offset) * cw, (y + offset) * ch);
  ctx.lineTo((x - offset) * cw, (y + offset) * ch);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "none";
  ctx.strokeStyle = "none";
}

export function drawNode(
  ctx: CanvasRenderingContext2D,
  node: StoryNode,
  cw: number,
  ch: number,
  activeSubstoryID?: number
) {
  if (activeSubstoryID === node.id) {
    drawNodeSquare(ctx, node.x, node.y, cw, ch, 10, "yellow", "black");
    drawNodeSquare(ctx, node.x, node.y, cw, ch, 5, "blue", "none");
  } else {
    drawNodeSquare(ctx, node.x, node.y, cw, ch, 5, "red", "black");
  }
}
