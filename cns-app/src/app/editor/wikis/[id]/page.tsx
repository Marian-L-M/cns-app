import { notFound } from "next/navigation";

import prisma from "@/../prisma/db";
import WikiForm from "@/components/forms/WikiForm";
import { requireOwnerOrAdmin } from "@/lib/auth-guards";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/editor">Editor</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/editor/wikis">Wikis</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{wiki.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl">Edit Wiki</h1>
      </div>
      <WikiForm wiki={transformedWiki} infobox={infobox} />
    </div>
  );
}

// 2240907 Next action: Change description to a text field
// 2240907 Next action: Make Wiki body text fields generative
// 240908 fix structure -> Move edit into [id] folder
