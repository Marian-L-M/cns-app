import { requireAdmin } from "@/lib/auth-guards";
import prisma from "@/../prisma/db";
import UserAdminForm from "@/app/admin/users/UserAdminForm";

interface Props {
  params: { id: string };
}

export const metadata = {
  title: "Admin",
};

export default async function adminUserPage({ params }: Props) {
  await requireAdmin();
  const resolvedParams = await params;

  const user = await prisma?.user.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!user) {
    return <p className="text-destrucive">User Not Found</p>;
  }
  // Overwrite password with empty string on the server side
  user.password = "";

  return (
    <div>
      <UserAdminForm user={user} />
    </div>
  );
}
