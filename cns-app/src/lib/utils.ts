import { CanvasStyleItem } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  CanvasStyleItemTypeList,
  LineStyleItemTypeList,
  ObjectStyleItemTypeList,
} from "./constants/styles";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert e.g. Prisma Object to JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format error
export function formatError(error: any) {
  if (error.name === "ZodError") {
    // Zod errors
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );

    return fieldErrors.join(". ");
  } else if (
    error.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    // Handle Prisma Error
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return typeof error.message === "string"
      ? error.message
      : JSON.stringify(error.message);
  }
}

// 250806 To do unify and fix
type CanvasStyleItemTypeValues =
  (typeof CanvasStyleItemTypeList)[keyof typeof CanvasStyleItemTypeList];

type ObjectStyleItemTypeValues =
  (typeof ObjectStyleItemTypeList)[keyof typeof ObjectStyleItemTypeList];

type LineStyleItemTypeValues =
  (typeof LineStyleItemTypeList)[keyof typeof LineStyleItemTypeList];

export function getValueFirstOfEachStyleType(
  canvasStyleItems: CanvasStyleItem[]
): Record<CanvasStyleItemTypeValues, string> {
  const result = {} as Record<CanvasStyleItemTypeValues, string>;

  if (!canvasStyleItems) {
    return result;
  }

  Object.values(CanvasStyleItemTypeList).forEach((styleType) => {
    const firstItem = canvasStyleItems.find((item) => item.type === styleType);
    if (firstItem) {
      result[styleType] = firstItem.value;
    }
  });

  return result;
}

export function getValueFirstOfEachObjectType(
  canvasStyleItems?: CanvasStyleItem[]
): Record<ObjectStyleItemTypeValues, string> {
  const result = {} as Record<ObjectStyleItemTypeValues, string>;

  if (!canvasStyleItems) {
    return result;
  }

  Object.values(ObjectStyleItemTypeList).forEach((styleType) => {
    const firstItem = canvasStyleItems.find((item) => item.type === styleType);
    if (firstItem) {
      result[styleType] = firstItem.value;
    }
  });

  return result;
}

export function getValueFirstOfEachLineType(
  LineStyleItems: CanvasStyleItem[]
): Record<LineStyleItemTypeValues, string> {
  const result = {} as Record<LineStyleItemTypeValues, string>;

  Object.values(LineStyleItemTypeList).forEach((styleType) => {
    const firstItem = LineStyleItems.find((item) => item.type === styleType);
    if (firstItem) {
      result[styleType] = firstItem.value;
    }
  });

  return result;
}

interface FilterProps {
  array: CanvasStyleItem[];
  targetType: CanvasStyleItemType;
}

export function getFirstOfStyleType({ array, targetType }: FilterProps) {
  const found = array.find((obj) => obj.type === targetType);
  return found?.value;
}
