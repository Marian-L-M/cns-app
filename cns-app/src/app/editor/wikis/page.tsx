import Link from "next/link";
import { SessionProvider } from "next-auth/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/../prisma/db";
import { Button } from "@/components/ui/button";
import { requireAuthorOrAdmin } from "@/lib/auth-guards";
import { Role, UserProfile, UserWiki, Wiki } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

export type WikiWithAuthor = Wiki & {
  userWikis: (UserWiki & {
    user: {
      id: string;
      name: string;
      role: Role;
      userProfile: UserProfile | null;
    };
  })[];
};

export default async function WikiEditorPage() {
  // To do
  const wikis = await prisma.wiki.findMany({
    include: {
      userWikis: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              role: true,
              userProfile: true,
            },
          },
        },
      },
    },
  });

  const session = await requireAuthorOrAdmin();

  const getAuthorDisplayName = (wiki: WikiWithAuthor): string => {
    const owner = wiki.userWikis.find(
      (us) => us.role === "OWNER" || us.role === "EDITOR"
    );
    if (owner?.user?.userProfile?.displayName) {
      return owner.user.userProfile.displayName;
    }
    return "Unknown";
  };

  return (
    <SessionProvider session={session}>
      <div className="w-full flex flex-col gap-4 mt-5">
        <div
          className="flex border-b p-2 border-b-slate-200  justify-between items-center"
          id="title-row"
        >
          <h1 className="text-xl font-semibold">Wikis</h1>
          <div id="actions">
            <Button asChild>
              <Link href={"/editor/wikis/create"}>Create</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-md sm:border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Authors</TableHead>
                <TableHead>Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wikis.map((wiki) => (
                <TableRow key={wiki.id} data-href="/">
                  <TableCell>{wiki.id}</TableCell>
                  <TableCell>{wiki.title}</TableCell>
                  <TableCell>{wiki.type}</TableCell>
                  <TableCell>
                    {" "}
                    {wiki.tags.length > 0
                      ? wiki.tags.map((tag) => tag).join(", ")
                      : "No tags"}
                  </TableCell>
                  <TableCell>{getAuthorDisplayName(wiki)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link
                            href={`/wiki/${wiki.id}`}
                            className="w-max flex-1"
                          >
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href={`/editor/wikis/${wiki.id}`}
                            className="w-max flex-1"
                          >
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </SessionProvider>
  );
}
