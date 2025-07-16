export const CanvasStyleItemType = {
  FONT: "font",
  LINE_WIDTH: "lineWidth",
  FILL_STYLE: "fillStyle",
  STROKE_STYLE: "strokeStyle",
} as const;

export const ObjectStyleItemType = {
  ICON_SIZE: "size",
} as const;

export const AllStyleItemType = {
  ...CanvasStyleItemType,
  ...ObjectStyleItemType,
} as const;
