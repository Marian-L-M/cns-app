import UserForm from "@/components/forms/UserForm";
import DataTableSimple from "./data-table-simple";
import prisma from "../../../prisma/db";

const Users = async () => {
  const users = await prisma?.user.findMany();
  return (
    <div>
      <UserForm />
      <DataTableSimple users={users} />
    </div>
  );
};

export default Users;

// To do: Add pagination
