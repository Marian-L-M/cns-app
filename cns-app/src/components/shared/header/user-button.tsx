import { auth } from "@/auth";
import { UserIcon } from "lucide-react";
import Link from "next/link";

import { signOutUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const usernMenuItems = [
  {
    title: "Profile",
    url: "/user/profile",
  },
  {
    title: "Works",
    url: "/user/works",
  },
  {
    title: "Settings",
    url: "/user/settings",
  },
];

export default async function UserButton() {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild variant={"outline"}>
        <Link href={`/sign-in`}>
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name?.charAt(0).toUpperCase() ?? "U";
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            className="relative w-6 h-6 p-1 text-xs aspect-1/1 rounded-full ml-2 flex items-center justify-center bg-gray-800 text-white hover:bg-gray-600 hover:text-slate-200"
          >
            {firstInitial}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
                {session.user?.name}
              </div>
              <div className="text-sm text-muted-foreground leading-none">
                {session.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>
          {usernMenuItems.map((item) => (
            <DropdownMenuItem className="p-0 mb-1" key={`${item.title}-link`}>
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant={"ghost"}
                asChild
              >
                <Link href={item.url}>{item.title}</Link>
              </Button>
            </DropdownMenuItem>
          ))}
          {session?.user?.role === "ADMIN" && (
            <DropdownMenuItem className="p-0 mb-1">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant={"ghost"}
                asChild
              >
                <Link href="/admin" className="w-full">
                  Admin
                </Link>
              </Button>
            </DropdownMenuItem>
          )}
          {(session?.user?.role === "AUTHOR" ||
            session?.user?.role === "ADMIN") && (
            <DropdownMenuItem className="p-0 mb-1">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant={"ghost"}
                asChild
              >
                <Link href="/editor" className="w-full">
                  Editor
                </Link>
              </Button>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="p-0 mb-1">
            <form action={signOutUser} className="w-full">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant={"ghost"}
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
