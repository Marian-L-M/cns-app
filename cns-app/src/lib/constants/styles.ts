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

export const SubstoryStyleType = {
  LINE_WIDTH: "lineWidth",
  LINE_COLOR: "lineColor",
  LINE_INDICATOR: "lineIndicator",
  ICON_TYPE: "iconType",
  ICON_SIZE: "iconSize",
  ICON_COLOR: "iconColor",
} as const;
