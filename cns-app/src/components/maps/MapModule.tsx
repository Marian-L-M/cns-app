"use client";
import { useDraw } from "@/hooks/useDraw";
import React, { useState } from "react";
import { FC } from "react";

// Canvas Integration
// https://www.youtube.com/watch?v=yOjJy0L7Rt8&ab_channel=Joshtriedcoding

interface pageProps {}

const MapModule: FC<pageProps> = ({}) => {
  const [color, setColor] = useState<string>("#abc");
  const { canvasRef, onMouseDown } = useDraw(drawLine);

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = "#000";
    const lineWidth = 5;

    // setColor not needed for EOM,but hook up to color picker etc.

    // Line
    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    // Line nodes
    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <div className="w-scren h-screen bg-white justify-center items-center">
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={750}
        height={750}
        className="border border-grey rounded-md"
      />
    </div>
  );
};

export default MapModule;
