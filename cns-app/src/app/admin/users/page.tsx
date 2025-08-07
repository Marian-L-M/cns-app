import { requireAdmin } from "@/lib/auth-guards";
import DataTableSimple from "./data-table-simple";
import prisma from "@/../prisma/db";

export const metadata = {
  title: "User management",
};

export default async function adminPage() {
  await requireAdmin();
  const users = await prisma.user.findMany();

  return (
    <div>
      <DataTableSimple users={users} />
    </div>
  );
}
