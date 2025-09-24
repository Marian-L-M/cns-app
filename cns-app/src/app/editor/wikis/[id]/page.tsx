import { notFound } from "next/navigation";

import prisma from "@/../prisma/db";
import WikiForm from "@/components/forms/WikiForm";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";

// import EditWikiClient from "./client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditWikiPage({ params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const wiki = await prisma.wiki.findUnique({
    where: { id: id },
    include: {
      userWikis: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!wiki) {
    return notFound();
  }

  const infobox = await prisma.wikiInfoboxItem.findMany({
    where: { wikiId: id },
    orderBy: { order: "asc" },
  });

  // Check if current user has permission to edit
  const session = await requireOwnerOrAdmin({
    userJunction: wiki.userWikis,
  });

  // Dirty fix for db issue
  const transformedWiki = {
    ...wiki,
    userWikis: wiki.userWikis.map((userWiki) => ({
      id: userWiki.id.toString(),
      userId: userWiki.userId,
      role: userWiki.role.toString(),
      user: {
        id: userWiki.user.id,
        name: userWiki.user.name,
        email: userWiki.user.email,
      },
    })),
  };

  return <WikiForm wiki={transformedWiki} infobox={infobox} />;
}

// 2240907 Next action: Change description to a text field
// 2240907 Next action: Make Wiki body text fields generative
// 240908 fix structure -> Move edit into [id] folder
