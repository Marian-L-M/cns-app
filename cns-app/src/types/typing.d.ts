type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

type DrawMapArea = {
  id: number;
  name: string;
  nodes: Point[];
};

type Point = { x: number; y: number };
