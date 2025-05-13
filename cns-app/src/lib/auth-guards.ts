import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return session;
}

export async function requireEditorOrAdmin() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "EDITOR") {
    redirect("/unauthorized");
  }

  return session;
}

// export async function requirSpecificEditorOrAdmin({ item: any }) {
//   const session = await auth();

//   // if admin or
//  // if item author = session?.user
// }
