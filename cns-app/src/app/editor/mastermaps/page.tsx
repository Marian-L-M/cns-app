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
import { Check, EllipsisVertical, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MapHierarchyMaster,
  Role,
  UserMapHierarchy,
  UserProfile,
} from "@prisma/client";

export type MasterMapWithAuthor = MapHierarchyMaster & {
  userMapHierarchies: (UserMapHierarchy & {
    user: {
      id: string;
      name: string;
      role: Role;
      userProfile: UserProfile | null;
    };
  })[];
};

export default async function MasterMapPage() {
  const masterMaps = await prisma.mapHierarchyMaster.findMany({
    include: {
      parentMap: {
        select: {
          id: true,
          title: true,
        },
      },
      childMaps: {
        select: {
          id: true,
          childMap: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      userMapHierarchies: {
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

  const getAuthorDisplayName = (masterMap: MasterMapWithAuthor): string => {
    const owner = masterMap.userMapHierarchies.find(
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
          <h1>Mastermaps</h1>
          <div id="actions">
            <Button asChild>
              <Link href={"/editor/mastermaps/create"}>Create</Link>
            </Button>
          </div>
        </div>
        <div className="rounded-md sm:border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Parent Map</TableHead>
                <TableHead>Child Maps</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {masterMaps.map((map) => (
                <TableRow key={map.id}>
                  <TableCell>{map.id}</TableCell>
                  <TableCell>{map.title}</TableCell>
                  <TableCell>{map.featured ? <Check /> : <X />}</TableCell>
                  <TableCell>
                    <Link href={`/maps/${map.parentMapId}`}>
                      {map.parentMap?.title || map.parentMapId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {map.childMaps.length > 0 ? (
                      <div className="flex gap-2 flex-wrap">
                        {map.childMaps.map((child) => (
                          <Link
                            href={`/maps/${child.childMap.id}`}
                            key={child.childMap.id}
                          >
                            {child.childMap.title}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      "No child aps"
                    )}
                  </TableCell>
                  <TableCell>{getAuthorDisplayName(map)}</TableCell>
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
                            href={`/mastermaps/${map.id}`}
                            className="w-max flex-1"
                          >
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link
                            href={`/editor/mastermaps/${map.id}`}
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
