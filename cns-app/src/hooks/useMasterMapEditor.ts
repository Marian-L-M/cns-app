import { useEffect, useRef } from "react";

export const useMasterMapEditor = ({ childMaps }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Canvas values
    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Click events
    const r = canvas.getBoundingClientRect();

    console.log(childMaps);
  });
  return { canvasRef };
};
