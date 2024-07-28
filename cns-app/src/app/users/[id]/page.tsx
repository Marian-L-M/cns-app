import UserForm from "@/components/forms/UserForm";
import prisma from "../../../../prisma/db";

interface Props {
  params: { id: string };
}

const EditUser = async ({ params }: Props) => {
  const user = await prisma?.user.findUnique({
    where: { id: params.id },
    // select: {
    //   id: true,
    //   name: true,
    //   username: true,
    //   email: true,
    //   image: true,
    //   role: true,
    //   password: true,
    // },
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
