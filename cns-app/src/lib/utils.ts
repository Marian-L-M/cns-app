import { CanvasStyleItem } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

const CANVAS_STYLE_TYPES = ["font", "lineWidth", "fillStyle", "strokeStyle"];

export function getValueFirstOfEachStyleType(
  canvasStyleItems: CanvasStyleItem[]
) {
  const result: Record<string, string> = {};

  CANVAS_STYLE_TYPES.forEach((styleType) => {
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
