import { requireAdmin } from "@/lib/auth-guards";
import prisma from "@/../prisma/db";
import UserProfileForm from "@/components/forms/UserProfileForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Edit Profile",
};

export default async function userProfilePage({ params }: Props) {
  const session = await requireAdmin();
  const resolvedParams = await params;

  const user = await prisma?.user.findUnique({
    where: { id: resolvedParams.id },
    include: {
      userProfile: true,
    },
  });

  if (!user) {
    return <p className="text-destrucive">User Not Found</p>;
  }
  // Overwrite password with empty string on the server side
  user.password = "";
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/users">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/users/${user.id}`}>
                {user.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl">Edit User Profile</h1>
      </div>
      <UserProfileForm user={user} />
    </div>
  );
}
