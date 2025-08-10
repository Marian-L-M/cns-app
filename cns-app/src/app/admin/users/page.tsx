import { requireAdmin } from "@/lib/auth-guards";
import DataTable from "./data-table";
import prisma from "@/../prisma/db";

export const metadata = {
  title: "User management",
};

export default async function adminUsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany();

  return (
    <div>
      <DataTable users={users} />
    </div>
  );
}
