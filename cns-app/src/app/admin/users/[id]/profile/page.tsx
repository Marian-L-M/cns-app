import { requireAdmin } from "@/lib/auth-guards";
import prisma from "@/../prisma/db";
import UserProfileForm from "@/components/forms/UserProfileForm";

interface Props {
  params: { id: string };
}

export const metadata = {
  title: "Edit Profile",
};

export default async function userProfilePage({ params }: Props) {
  await requireAdmin();
  const resolvedParams = await params;

  const user = await prisma?.user.findUnique({
    where: { id: resolvedParams.id },
    include: {
      RelatedUser: true,
    },
  });

  if (!user) {
    return <p className="text-destrucive">User Not Found</p>;
  }
  // Overwrite password with empty string on the server side
  user.password = "";
  return (
    <>
      <UserProfileForm user={user} />
    </>
  );
}
