import { useEffect, useRef, useState } from "react";

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void
) => {
  const [mouseDown, setMouseDown] = useState(false); // Draw only when mouse is clicked

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<null | Point>(null);

  // Mouse actions
  const onMouseDown = () => setMouseDown(true);

  // Clear Canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Draw on canvas
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!mouseDown) return;

      const currentPoint = computePointInCanvas(e);

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !currentPoint) return;

      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
      prevPoint.current = currentPoint;
    };

    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    };

    const mouseUpHandler = () => {
      setMouseDown(false);
      prevPoint.current = null;
    };

    // Add event listeners
    canvasRef.current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseUpHandler);

    // Remove event listeners
    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };

    // onDraw is received from outside of useDraw so needs to be put in dependency array
  }, [onDraw]);

  return { canvasRef, onMouseDown, clearCanvas };
};

// MapModule
// const [color, setColor] = useState<string>("#abc");
// const { canvasRef, onMouseDown, clearCanvas } = useMapMaker(drawAreas);

// function drawAreas({ prevPoint, currentPoint, ctx }: Draw) {
//   const { x: currX, y: currY } = currentPoint;
//   const lineColor = "#000";
//   const lineWidth = 5;

//   // setColor not needed for EOM,but hook up to color picker etc.

//   // Line
//   let startPoint = prevPoint ?? currentPoint;
//   ctx.beginPath();
//   ctx.lineWidth = lineWidth;
//   ctx.strokeStyle = color;
//   ctx.moveTo(startPoint.x, startPoint.y);
//   ctx.lineTo(currX, currY);
//   ctx.stroke();

//   // Line nodes
//   ctx.fillStyle = lineColor;
//   ctx.beginPath();
//   ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
//   ctx.fill();
// }
