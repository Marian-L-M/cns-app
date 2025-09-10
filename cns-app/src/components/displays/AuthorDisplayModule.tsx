import {
  UserMap,
  UserMapHierarchy,
  UserProfile,
  UserStory,
  UserWiki,
} from "@prisma/client";

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
    <div className="flex flex-col gap-8 border border-slate-200 rounded-md py-4 px-2">
      <h3 className="text-md w-full bg-gray-200 text-center">Auhors</h3>
      <div className="flex flex-col gap-4">
        {authors.map((author) => (
          <div key={`author-${author.userId}`} className="w-full">
            {author.user.relatedUser.displayName}
          </div>
        ))}
      </div>
    </div>
  );
}
