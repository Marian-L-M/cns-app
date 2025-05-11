import prisma from "@/../prisma/db";

import UserForm from "@/components/forms/UserForm";

interface Props {
  params: { id: string };
}

export default async function EditUser({ params }: Props) {
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
}
