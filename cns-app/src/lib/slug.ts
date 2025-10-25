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
  existingId?: number
): Promise<string> {
  let slug = generateSlug(title);
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    switch (dataType) {
      case "map":
        const existing = await prisma.map.findUnique({
          where: { slug },
          select: { id: true },
        });

        // Check if unique else add counter
        if (!existing || existing.id === existingId) {
          isUnique = true;
        } else {
          slug = `${generateSlug(title)}-${counter}`;
          counter++;
        }
        break;
      default:
        break;
    }
  }

  return slug;
}
