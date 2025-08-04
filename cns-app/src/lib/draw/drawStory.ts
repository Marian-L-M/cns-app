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

// Unify with useMapEditor drawmeta node)
export function drawMetaNode(
  ctx: CanvasRenderingContext2D,
  node: StoryNode,
  cw: number,
  ch: number
) {
  const iconSize = node.iconSize || 10;
  drawNodeSquare(ctx, node.x, node.y, cw, ch, iconSize, "unset", "unset");
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

export function drawNodeCircle(
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
  ctx.arc(x * cw, y * ch, offset, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "none";
  ctx.strokeStyle = "none";
}

export function drawNodeDiamond(
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
  ctx.moveTo(x * cw, (y - offset) * ch);
  ctx.lineTo((x + offset) * cw, y * ch);
  ctx.lineTo(x * cw, (y + offset) * ch);
  ctx.lineTo((x - offset) * cw, y * ch);
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
  const iconSize = node.iconSize || 5;
  const iconColor = node.iconColor || "#ffffff";
  if (activeSubstoryID === node.id) {
    drawNodeSquare(
      ctx,
      node.x,
      node.y,
      cw,
      ch,
      iconSize + 3,
      "#ff0f0f",
      "black"
    ); // Border
    drawNodeSquare(ctx, node.x, node.y, cw, ch, iconSize, iconColor, "none");
  } else {
    drawNodeSquare(ctx, node.x, node.y, cw, ch, iconSize, iconColor, "black");
  }
}

export function drawNodeAsCircle(
  ctx: CanvasRenderingContext2D,
  node: StoryNode,
  cw: number,
  ch: number,
  activeSubstoryID?: number
) {
  const iconSize = node.iconSize || 5;
  const iconColor = node.iconColor || "#ffffff";
  if (activeSubstoryID === node.id) {
    drawNodeCircle(
      ctx,
      node.x,
      node.y,
      cw,
      ch,
      iconSize / 2 + 3,
      "#ff0f0f",
      "black"
    );
    drawNodeCircle(
      ctx,
      node.x,
      node.y,
      cw,
      ch,
      iconSize / 2,
      iconColor,
      "none"
    );
  } else {
    drawNodeCircle(
      ctx,
      node.x,
      node.y,
      cw,
      ch,
      iconSize / 2,
      iconColor,
      "none"
    );
  }
}

export function drawNodeAsDiamond(
  ctx: CanvasRenderingContext2D,
  node: StoryNode,
  cw: number,
  ch: number,
  activeSubstoryID?: number
) {
  const iconSize = node.iconSize || 5;
  const iconColor = node.iconColor || "#ffffff";
  if (activeSubstoryID === node.id) {
    drawNodeDiamond(
      ctx,
      node.x,
      node.y,
      cw,
      ch,
      iconSize + 3,
      "#ff0f0f",
      "black"
    );
    drawNodeDiamond(ctx, node.x, node.y, cw, ch, iconSize, iconColor, "none");
  } else {
    drawNodeDiamond(ctx, node.x, node.y, cw, ch, iconSize, iconColor, "none");
  }
}

export function drawStoryNode(
  ctx: CanvasRenderingContext2D,
  node: StoryNode,
  cw: number,
  ch: number,
  imageCache: any,
  activeSubstoryID?: number
) {
  switch (node.iconType) {
    case "CIRCLE":
      drawNodeAsCircle(ctx, node, cw, ch, activeSubstoryID);
      break;
    case "DIAMOND":
      drawNodeAsDiamond(ctx, node, cw, ch, activeSubstoryID);
      break;
    case "ICON":
      if (node.iconUrl && node.iconUrl.trim() !== "") {
        const cachedIcon = imageCache.current.get(node.iconUrl);
        if (cachedIcon) {
          drawNodeAsCircle(ctx, node, cw, ch, activeSubstoryID);
          const iconSize = node.iconSize || 20;
          ctx.save();
          ctx.drawImage(
            // Icon at ~75% of circle
            cachedIcon,
            (node.x - iconSize / 3) * cw,
            (node.y - iconSize / 3) * ch,
            iconSize / 1.5,
            iconSize / 1.5
          );
          ctx.restore();
        } else {
          drawNodeAsCircle(ctx, node, cw, ch, activeSubstoryID);
        }
      } else {
        drawNodeAsCircle(ctx, node, cw, ch, activeSubstoryID);
      }
      break;
    default:
      drawNode(ctx, node, cw, ch, activeSubstoryID);
  }
}

export function drawStoryLabel(
  ctx: CanvasRenderingContext2D,
  node: StoryNode,
  cw: number,
  ch: number
) {
  const fontSize = 16;
  const fontColor = node.fontColor || "#fff";
  const iconSize = node.iconSize || 10;
  const iconDiameter =
    node.iconType === "CIRCLE" || node.iconType === "ICON"
      ? iconSize / 2
      : iconSize;

  // Draw label
  const textMetrics = ctx.measureText(node.name);
  const textWidth = textMetrics.width;
  const textHeight = fontSize;
  const twHalf = textWidth / 2;
  const thHalf = textHeight / 2;
  const fillStyle = node.labelColor || "#000";
  const strokeStyle = fontColor;
  const padX = 10;
  const padY = 5;
  const labelOffset = iconDiameter + fontSize + padY * 2;

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.moveTo(
    (node.x - padX - twHalf) * cw,
    (node.y - padY - thHalf + labelOffset) * ch
  );
  ctx.lineTo(
    (node.x + padX + twHalf) * cw,
    (node.y - padY - thHalf + labelOffset) * ch
  );
  ctx.lineTo(
    (node.x + padX + twHalf) * cw,
    (node.y + padY + thHalf + labelOffset) * ch
  );
  ctx.lineTo(
    (node.x - padX - twHalf) * cw,
    (node.y + padY + thHalf + labelOffset) * ch
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "none";
  ctx.strokeStyle = "none";

  // Draw Text
  ctx.font = `${fontSize}px mono`;
  ctx.fillStyle = fontColor;
  ctx.textAlign = "center";
  ctx.fillText(
    node.name,
    node.x * cw,
    (node.y + labelOffset + padY / 2 + thHalf / 2) * ch
  );
}
