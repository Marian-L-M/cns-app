import { useEffect, useRef } from "react";
import { drawAreas } from "@/lib/map/drawMap";

export const useMapMaker = ({ data }: MapModuleProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { map, mapObjects, mapAreas } = data;

  useEffect(() => {
    // Set canvas
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Grid 1000*1000
    const cw = canvas.width / 1000;
    const ch = canvas.height / 1000;

    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw Areas
    mapAreas?.forEach((area: GlobalAreaType) => {
      area.nodes.forEach((node: DrawMapArea) => {
        drawAreas(ctx, node, cw, ch);
      });
    });
  }, []);

  return { canvasRef };
};
