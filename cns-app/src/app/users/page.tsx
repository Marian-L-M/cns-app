import DataTableSimple from "./data-table-simple";
import prisma from "../../../prisma/db";

export default async function UserOverviewPage() {
  const users = await prisma?.user.findMany();
  return (
    <div>
      <DataTableSimple users={users} />
    </div>
  );
}

// To do: Add pagination
