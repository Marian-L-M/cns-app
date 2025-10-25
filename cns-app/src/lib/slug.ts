import { title } from "process";

// Transform title to slug format
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Check if slug is unique
export async function generateUniqueSlug(
  title: string,
  prisma: any,
  dataType: string, // Change to enumeration
  currentId?: number
): Promise<string> {
  let slug = generateSlug(title);
  let counter = 1;

  // If existing object, check if slug has changed, update if changed
  if (currentId) {
    // Check if object exists at id
    const existing = await prisma[dataType].findUnique({
      where: { id: currentId },
      select: { id: true, slug: true },
    });

    // Check if slug update needed
    if (!existing || existing.slug == slug) return slug;
    else {
      slug = await checkOrGenerateUnique(dataType, prisma, slug, counter);
    }

    return slug;
  } else {
    slug = await checkOrGenerateUnique(dataType, prisma, slug, counter);
  }

  return slug;
}

async function checkOrGenerateUnique(
  dataType: any,
  prisma: any,
  slug: string,
  counter: number
) {
  let isUnique = false;
  let newSlug = slug;

  while (!isUnique) {
    const existing = await prisma[dataType].findUnique({
      where: { slug: newSlug },
      select: { id: true },
    });

    if (!existing) {
      isUnique = true;
    } else {
      newSlug = `${generateSlug(title)}-${counter}`;
      counter++;
    }
  }

  return newSlug;
}
