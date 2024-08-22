type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

// For Map Schema
type MapType = z.infer<typeof mapSchema>;
type GlobalAreaType = z.infer<typeof GlobalAreasSchema>;
type GlobalObjectType = z.infer<typeof GlobalObjectsSchema>;
type GlobalStoryType = z.infer<typeof storyObjectsSchema>;

// For passing Map data to MapModule
interface MapModuleProps {
  data: {
    map: Map;
    mapObjects: GlobalObjectType[];
    mapAreas: GlobalAreaType[];
  };
}
interface StoryModuleProps {
  data: {
    map: Map;
    mapObjects: GlobalObjectType[];
    mapAreas: GlobalAreaType[];
  };
  story: story[];
}

// For Drawing Map area from nodes
type DrawMapArea = {
  id: number;
  name: string;
  nodes: Point[];
  fillStyle: string;
  strokeStyle: string;
};

type DrawMapObject = {
  id: number;
  title: string;
  x: number;
  y: number;
};

// For status response
type ClickStatus = {
  title: string;
  type: string;
  id: number;
};

type StoryClickStatus = {
  title: string;
  description: string;
  type: string;
  id: number;
};

// Node for drawing map area
type Point = { x: number; y: number };

interface story {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  nodes: JsonValue;
  objectTime: number;
  entryId: number;
}

interface storyNode {
  id: number;
  name: string;
  description: string;
  timeStart: number;
  timeEnd: number;
  x: number;
  y: number;
}
