import { auth } from "@/auth";
import { ContentRole, MediaItem } from "@prisma/client";
import { redirect } from "next/navigation";

type UserJunctionType = {
  userId: string;
  role: ContentRole;
  user: {
    id: string;
    [key: string]: any; // Allow additional user properties
  };
}[];

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
  userJunction: UserJunctionType | undefined;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!userJunction) {
    redirect("/unauthorized");
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

export async function requireMediaOwnerOrAdmin({
  mediaItem,
}: {
  mediaItem: MediaItem | undefined;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (!mediaItem) {
    redirect("/unauthorized");
  }

  const sessionId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  const isOwner = sessionId === mediaItem.uploadedById;

  if (!isAdmin && !isOwner) {
    redirect("/unauthorized");
  }

  return session;
}
