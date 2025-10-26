import UserProfileDisplay from "@/components/displays/UserProfileDisplayModule";
import prisma from "@/../prisma/db";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function authorProfilePage({ params }: Params) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const profile = await prisma.userProfile.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!profile) {
    return (
      <div className="w-full flex flex-col gap-4">
        <p className="alert">No profile found</p>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <UserProfileDisplay profile={profile} />
    </div>
  );
}
