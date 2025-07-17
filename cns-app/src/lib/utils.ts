import { CanvasStyleItem } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CanvasStyleItemType, ObjectStyleItemType } from "./constants/styles";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert e.g. Prisma Object to JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

type CanvasStyleItemTypeValues =
  (typeof CanvasStyleItemType)[keyof typeof CanvasStyleItemType];

export function getValueFirstOfEachStyleType(
  canvasStyleItems: CanvasStyleItem[]
): Record<CanvasStyleItemTypeValues, string> {
  const result = {} as Record<CanvasStyleItemTypeValues, string>;

  Object.values(CanvasStyleItemType).forEach((styleType) => {
    const firstItem = canvasStyleItems.find((item) => item.type === styleType);
    if (firstItem) {
      result[styleType] = firstItem.value;
    }
  });

  return result;
}

type ObjectStyleItemTypeValues =
  (typeof ObjectStyleItemType)[keyof typeof ObjectStyleItemType];

export function getValueFirstOfEachObjectType(
  canvasStyleItems: CanvasStyleItem[]
): Record<ObjectStyleItemTypeValues, string> {
  const result = {} as Record<ObjectStyleItemTypeValues, string>;

  Object.values(ObjectStyleItemType).forEach((styleType) => {
    const firstItem = canvasStyleItems.find((item) => item.type === styleType);
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
