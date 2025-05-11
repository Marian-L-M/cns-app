import prisma from "@/../prisma/db";

export async function fetchUserProfile(userId: string | undefined) {
  if (!userId) return;

  const userProfile = await prisma.userProfile.findFirst({
    where: { UserId: userId },
  });

  return { userProfile };
}
