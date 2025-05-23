import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return session;
}

export async function requireAuthorOrAdmin() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "AUTHOR") {
    redirect("/unauthorized");
  }

  return session;
}

export async function requireOwnerOrAdmin({ authors }: any) {
  const session = await auth();

  const isAdmin = session?.user?.role === "ADMIN";
  const isEditor = session?.user?.role === "AUTHOR";
  const isOwner = authors.some(
    (author: any) => author.id === session?.user?.id
  );

  if (!isAdmin && !isEditor) {
    redirect("/unauthorized");
  } else if (!isAdmin && !isOwner) {
    redirect("/unauthorized/editor");
  }

  return session;
}
