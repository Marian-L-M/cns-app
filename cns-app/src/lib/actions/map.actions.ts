// Rewrite map functions with proper take limitation.
// Transform api calls to server actions -> (T22)
import { PrismaClient } from "@prisma/client";
import { convertToPlainObject } from "../utils";

export async function getLatestMaps(amount: number) {
  const prisma = new PrismaClient();

  const data = await prisma.map.findMany({
    take: amount,
    orderBy: { createdAt: `desc` },
  });

  return convertToPlainObject(data);
}

// To do: Create a paginatable getMaps function with take, skip etc
