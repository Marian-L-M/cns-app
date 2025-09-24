// types/wiki.ts
import { Prisma } from "@prisma/client";

// Define the user select structure for consistency
export const userSelectForAuthors = {
  id: true,
  userProfile: true,
} as const;

// Define the include structure for wiki queries
export const wikiIncludeWithAuthors = {
  userWikis: {
    include: {
      user: {
        select: userSelectForAuthors,
      },
    },
  },
} as const;

// Create payload types
export type WikiWithAuthors = Prisma.WikiGetPayload<{
  include: typeof wikiIncludeWithAuthors;
}>;

export type UserWikiWithUser = Prisma.UserWikiGetPayload<{
  include: {
    user: {
      select: typeof userSelectForAuthors;
    };
  };
}>;

// For other junction tables if needed
export type UserMapWithUser = Prisma.UserMapGetPayload<{
  include: {
    user: {
      select: typeof userSelectForAuthors;
    };
  };
}>;

export type UserStoryWithUser = Prisma.UserStoryGetPayload<{
  include: {
    user: {
      select: typeof userSelectForAuthors;
    };
  };
}>;

export type UserMapHierarchyWithUser = Prisma.UserMapHierarchyGetPayload<{
  include: {
    user: {
      select: typeof userSelectForAuthors;
    };
  };
}>;

export type AuthorWithUser =
  | UserWikiWithUser
  | UserMapWithUser
  | UserStoryWithUser
  | UserMapHierarchyWithUser;
