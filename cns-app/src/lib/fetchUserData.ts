import prisma from "@/../prisma/db";

export const fetchUserProfile = async (userId: string | undefined) => {
  if (!userId) return;

  const userProfile = await prisma.userProfile.findFirst({
    where: { UserId: userId },
  });

  return { userProfile };
};
