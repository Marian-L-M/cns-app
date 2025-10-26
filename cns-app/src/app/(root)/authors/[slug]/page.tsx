import UserProfileDisplay from "@/components/displays/UserProfileDisplayModule";
import prisma from "@/../prisma/db";

interface Params {
  params: Promise<{ slug: string }>;
}

export default async function authorProfilePage({ params }: Params) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const profile = await prisma.userProfile.findUnique({
    where: {
      slug: slug,
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
