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

export async function requireOwnerOrAdmin({
  userJunction,
}: {
  userJunction: Array<{ userId: string; role: string; user: { id: string } }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const sessionId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  // Check if user is owner or editor of this content
  const userRelation = userJunction.find((us) => us.userId === sessionId);

  const isOwner = userRelation?.role === "OWNER";
  const isEditor = userRelation?.role === "EDITOR";

  if (!isAdmin && !isOwner && !isEditor) {
    redirect("/unauthorized");
  }

  return session;
}
