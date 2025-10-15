import { requireAdmin } from "@/lib/auth-guards";
import DataTable from "./data-table";
import prisma from "@/../prisma/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "User management",
};

export default async function adminUsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany();

  return (
    <div className="w-full flex flex-col gap-4 mt-5">
      <div
        className="flex border-b p-2 border-b-slate-200  justify-between items-center"
        id="title-row"
      >
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Users</h1>
        </div>
        <div id="actions">
          <Button asChild>
            <Link href={"/admin/users/create"}>Create</Link>
          </Button>
        </div>
      </div>
      <DataTable users={users} />
    </div>
  );
}
