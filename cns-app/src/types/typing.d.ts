type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

// For Map Schema
type MapType = z.infer<typeof mapSchema>;
type GlobalAreaType = z.infer<typeof GlobalAreasSchema>;
type GlobalObjectType = z.infer<typeof GlobalObjectsSchema>;

// For passing Map data to MapModule
interface MapModuleProps {
  data: {
    map: Map;
    mapObjects: GlobalObjectType[];
    mapAreas: GlobalAreaType[];
  };
}

// For Drawing Map area from nodes
type DrawMapArea = {
  id: number;
  name: string;
  nodes: Point[];
  fillStyle: string;
  strokeStyle: string;
};

// Node for drawing map area
type Point = { x: number; y: number };
