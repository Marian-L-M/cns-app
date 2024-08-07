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

// export interface IdMappingEntity {
//   id: number;
//   mapId: number;
// }

type MapType = z.infer<typeof mapSchema>;
type GlobalAreaType = z.infer<typeof GlobalAreasSchema>;
type GlobalObjectType = z.infer<typeof GlobalObjectsSchema>;
