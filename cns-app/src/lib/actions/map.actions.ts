// Rewrite map functions with proper take limitation.
// Transform api calls to server actions -> (T22)
import { PrismaClient } from "@prisma/client";
import { convertToPlainObject } from "@/lib/utils";

// Action only in name. Consider moving directory
export async function getLatestMaps(limit: number) {
  const prisma = new PrismaClient();

  const data = await prisma.map.findMany({
    take: limit,
    orderBy: { createdAt: `desc` },
  });

  // return convertToPlainObject(data);
  return data;
}

export async function getAllMaps({
  limit,
  page,
}: {
  limit: number;
  page: number;
}) {
  const prisma = new PrismaClient();

  const data = await prisma.map.findMany({
    // skip: (page - 1) * limit,
    // take: limit,
  });

  const dataCount = await prisma.map.count();

  return { data, totalPages: Math.ceil(dataCount / limit) };
}
