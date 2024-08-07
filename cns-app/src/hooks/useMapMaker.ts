import { useEffect, useRef } from "react";
import prisma from "../../prisma/db";

interface Point {
  x: number;
  y: number;
}

export const useMapMaker = (mapId: number) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // // Get associated areas
  // const areas = await prisma.globalArea.findMany({
  //   where: {
  //     mapId: mapId,
  //   },
  // });

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

    let data: DrawMapArea[] = [
      {
        id: 1,
        name: "Test-Map-1",
        nodes: [
          { x: 700, y: 100 },
          { x: 200, y: 100 },
          { x: 300, y: 300 },
          { x: 100, y: 200 },
        ],
      },
      {
        id: 2,
        name: "Test-Map-2",
        nodes: [
          { x: 100, y: 800 },
          { x: 300, y: 850 },
          { x: 450, y: 600 },
          { x: 250, y: 550 },
        ],
      },
      {
        id: 3,
        name: "Test-Map-3",
        nodes: [
          { x: 800, y: 550 },
          { x: 800, y: 750 },
          { x: 950, y: 750 },
          { x: 950, y: 550 },
        ],
      },
    ];

    // 240805 To Do: Connect Areas with DB, client side vs. server side issue
    // 240806 still unsolved / chatgpt doesnt get it./ the issue should be solvable by using get server side props
    // Draw Areas
    data.forEach((area: DrawMapArea) => {
      drawAreas(ctx, area.nodes);
    });

    function drawAreas(ctx: CanvasRenderingContext2D, nodes: Point[]) {
      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.strokeStyle = "black";
      ctx.moveTo(nodes[0].x * cw, nodes[0].y * ch);
      for (var i = 1; i < nodes.length; i++) {
        ctx.lineTo(nodes[i].x * cw, nodes[i].y * ch);
      }
      ctx.lineTo(nodes[0].x * cw, nodes[0].y * ch);
      ctx.stroke();
    }
  }, []);

  return { canvasRef };
};
