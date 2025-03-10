import UserForm from "@/components/forms/UserForm";
import prisma from "../../../../prisma/db";

interface Props {
  params: { id: string };
}

const EditUser = async ({ params }: Props) => {
  const resolvedParams = await params;

  const user = await prisma?.user.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!user) {
    return <p className="text-destrucive">User Not Found</p>;
  }

  // Removed filter -> select all fields
  // Overwrite password with empty string on the server side
  user.password = "";
  return <UserForm user={user} />;
};

export default EditUser;
