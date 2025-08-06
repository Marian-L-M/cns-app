// For Navigation
type MenuListItem = {
  title: string;
  url: string;
};

interface MenuListProps {
  menuList: MenuListItem[];
}

// For Drawing
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
  settings?: string;
}

// For Drawing Map area from nodes
type DrawMapArea = {
  id: number;
  name: string;
  nodes: Point[];
  fillStyle: string;
  strokeStyle: string;
};

type HierarchyConnection = {
  hierarchyChildId: number;
  hierarchyParentId: number;
  mapTitle: string;
};

type PointRectangularArea = {
  x: number;
  y: number;
  wx: number;
  wy: number;
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

type TooltipStatus = {
  id: number;
  title: string;
  imageUrl: string;
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
  storyId: number;
  canvasStyles?: CanvasStyleItem[];
}

type StoryNode = {
  id: number;
  x: number;
  y: number;
  name: string;
  description: string;
  timeStart?: number;
  timeEnd?: number;
  iconType?: string; // Individual icon overwrite Circle, Rectangle, diamond etc.
  iconUrl?: string;
  iconSize?: number;
  iconColor?: string;
  label: boolean;
  labelColor?: string;
  fontColor?: string;
};

interface areaNode {
  id: number;
  x: number;
  y: number;
}

// For Wiki Infobox
type ImageType = {
  id: number;
  type: "image";
  url: string;
  title: string;
  caption: string;
};

type BarType = {
  id: number;
  key: string;
  value: string;
};

type CollectionType = {
  id: number;
  type: "collection";
  title: string;
  bars: BarType[];
};

type TextType = {
  id: number;
  type: "text";
  title: string;
  content: string;
};

type InfoBoxItem = ImageType | CollectionType | TextType;

// Styles
type CanvasStyleItemType =
  | "fontSize"
  | "fontColor"
  | "fontType"
  | "lineWidth"
  | "fillStyle"
  | "strokeStyle";
type LineStyleItemType = "lineArrow" | "lineType" | "strokeStyle" | "lineWidth";
type ObjectStyleItemType = "size" | "opacity";
type SubstoryNodeType = "square" | "Circle" | "diamond" | "icon";
