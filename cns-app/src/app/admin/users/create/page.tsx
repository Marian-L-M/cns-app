import { requireAdmin } from "@/lib/auth-guards";
import prisma from "@/../prisma/db";
import UserAdminForm from "@/app/admin/users/UserAdminForm";
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
  title: "Admin",
};

export default async function adminUserPage({ params }: Props) {
  await requireAdmin();
  const resolvedParams = await params;

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
              <BreadcrumbPage>Create</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl">Edit User</h1>
      </div>
      <UserAdminForm />
    </div>
  );
}
