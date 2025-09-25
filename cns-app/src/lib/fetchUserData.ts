import prisma from "@/../prisma/db";

export async function fetchUserProfile(userId: string | undefined) {
  if (!userId) {
    return { userProfile: null };
  }

  const userProfile = await prisma.userProfile.findFirst({
    where: { userId: userId },
  });

  return { userProfile };
}

export async function fetchUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userProfile: true,
    },
  });

  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }

  return { user };
}
