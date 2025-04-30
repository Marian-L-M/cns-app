// User management for admins, not to confuse with /user for profile

import DataTableSimple from "./data-table-simple";
import prisma from "../../../prisma/db";

export default async function UserOverviewPage() {
  // const users = await prisma.user.findMany();
  const users = await prisma.user.findMany();
  console.log(users);

  // if (!users) return <div>Setup users please</div>;

  return (
    <div>
      <DataTableSimple users={users} />
    </div>
  );
}

// To do: Add pagination
