import prisma from "@/../prisma/db";

export async function fetchUserProfile(userId: string | undefined) {
  if (!userId) return;

  const userProfile = await prisma.userProfile.findFirst({
    where: { UserId: userId },
  });

  return { userProfile };
}

export async function fetchUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return { user };
}
