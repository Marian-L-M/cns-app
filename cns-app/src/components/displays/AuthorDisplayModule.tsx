import { Prisma } from "@prisma/client";
import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

// to do: Ai slop structure, clean up db
type UserWikiWithUser = Prisma.UserWikiGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        userProfile: true;
      };
    };
  };
}>;

type UserMapWithUser = Prisma.UserMapGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        userProfile: true;
      };
    };
  };
}>;

type UserStoryWithUser = Prisma.UserStoryGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        userProfile: true;
      };
    };
  };
}>;

type UserMapHierarchyWithUser = Prisma.UserMapHierarchyGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        userProfile: true;
      };
    };
  };
}>;

// Union type for all author types with user data
type AuthorWithUser =
  | UserWikiWithUser
  | UserMapWithUser
  | UserStoryWithUser
  | UserMapHierarchyWithUser;

interface Props {
  authors: AuthorWithUser[]; // For now, since you're only passing UserWiki data
}

export default function AuthorDisplayModule({ authors }: Props) {
  console.log(authors);
  return (
    <div className="flex flex-col gap-4 border border-slate-200 rounded-md py-4 px-2">
      <h3 className="text-md w-full bg-gray-200 text-center">Auhors</h3>
      <div className="flex flex-col gap-2">
        {authors.map((author) => (
          <div
            key={`author-${author.userId}`}
            className="w-full flex p-2 justify-between items-center"
          >
            <h5>{author.user.userProfile?.displayName}</h5>
            <Link href={`/authors/${author.id}`}>
              <Button variant={`outline`} className="text-xs h-6 p-1">
                <ChevronRight />
                Profile
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
