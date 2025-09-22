import { NextRequest, NextResponse } from "next/server";
import prisma from "@/../prisma/db";
import bcrypt from "bcryptjs";
import { userSchema } from "@/ValidationSchemas/users";

interface Props {
  params: Promise<{ id: string }>;
}

// 250808 To do: Does the delete routes need additionaly protection?
export async function PATCH(request: NextRequest, { params }: Props) {
  const body = await request.json();
  const validation = userSchema.safeParse(body);
  const resolvedParams = await params;

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User Not Found" }, { status: 400 });
  }

  if (body?.password && body.password != "") {
    const hashPassword = await bcrypt.hash(body.password, 10);
    body.password = hashPassword;
  } else {
    delete body.password;
  }

  // if (user.username !== body.username) {
  //   const duplicateUsername = await prisma.user.findUnique({
  //     where: { username: body.username },
  //   });
  //   if (duplicateUsername) {
  //     return NextResponse.json(
  //       { message: "Duplicate Username" },
  //       { status: 409 }
  //     );
  //   }
  // }

  const updateUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updateUser);
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const resolvedParams = await params;

  const user = await prisma.user.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  await prisma.user.delete({
    where: { id: user.id },
  });

  return NextResponse.json({ message: "user deleted" }, { status: 200 });
}
