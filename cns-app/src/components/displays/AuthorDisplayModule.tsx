import {
  UserMap,
  UserMapHierarchy,
  UserProfile,
  UserStory,
  UserWiki,
} from "@prisma/client";
import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

interface props {
  authors:
    | UserWiki[]
    | UserMap[]
    | UserProfile[]
    | UserStory[]
    | UserMapHierarchy[];
}

export default function AuthorDisplayModule({ authors }: props) {
  return (
    <div className="flex flex-col gap-4 border border-slate-200 rounded-md py-4 px-2">
      <h3 className="text-md w-full bg-gray-200 text-center">Auhors</h3>
      <div className="flex flex-col gap-2">
        {authors.map((author) => (
          <div
            key={`author-${author.userId}`}
            className="w-full flex p-2 justify-between items-center"
          >
            <h5>{author.user.userProfile.displayName}</h5>
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
