export const CanvasStyleItemType = {
  FONT: "font",
  LINE_WIDTH: "lineWidth",
  FILL_STYLE: "fillStyle",
  STROKE_STYLE: "strokeStyle",
} as const;

export const ObjectStyleItemType = {
  ICON_SIZE: "size",
  ICON_OPACITY: "opacity",
} as const;

export const AllStyleItemType = {
  ...CanvasStyleItemType,
  ...ObjectStyleItemType,
} as const;
