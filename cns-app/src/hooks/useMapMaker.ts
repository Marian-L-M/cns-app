import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

export const initializeMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    let points: Point[] = [
      { x: 100, y: 100 },
      { x: 200, y: 100 },
      { x: 300, y: 300 },
      { x: 100, y: 200 },
      { x: 100, y: 100 },
    ];

    // Draw
    if (ctx) {
      drawAreas(ctx, points);
    }

    function drawAreas(ctx: CanvasRenderingContext2D, points: Point[]) {
      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.strokeStyle = "black";
      ctx.moveTo(points[0].x, points[0].y);
      for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.lineTo(points[0].x, points[0].y);
      ctx.stroke();
      console.log("complete");
    }
  }, []);

  return { canvasRef };
};
