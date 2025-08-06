export const CanvasStyleItemTypeList = {
  FONT_SIZE: "fontSize",
  FONT_COLOR: "fontColor",
  FONT_TYPE: "fontType",
  LINE_WIDTH: "lineWidth",
  FILL_STYLE: "fillStyle",
  STROKE_STYLE: "strokeStyle",
} as const;

export const ObjectStyleItemTypeList = {
  ICON_SIZE: "size",
  ICON_OPACITY: "opacity",
} as const;

export const LineStyleItemTypeList = {
  LINE_ARROW: "lineArrow",
  LINE_TYPE: "lineType",
  STROKE_STYLE: "strokeStyle",
  LINE_WIDTH: "lineWidth",
} as const;

export const AllStyleItemTypeList = {
  ...CanvasStyleItemTypeList,
  ...ObjectStyleItemTypeList,
  ...LineStyleItemTypeList,
} as const;

export const SubstoryStyleTypeList = {
  LINE_WIDTH: "lineWidth",
  LINE_COLOR: "lineColor",
  LINE_INDICATOR: "lineIndicator",
  ICON_TYPE: "iconType",
  ICON_SIZE: "iconSize",
  ICON_COLOR: "iconColor",
} as const;
