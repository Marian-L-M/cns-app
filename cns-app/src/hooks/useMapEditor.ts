import { useEffect, useRef } from "react";

export const useMapEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = (context: CanvasRenderingContext2D) => {
    context.fillStyle = "grey";
    context.fillRect(10, 10, 100, 100);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Canvas values
    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    draw(ctx);
    // // Clear canvas
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);
  return { canvasRef };
};
