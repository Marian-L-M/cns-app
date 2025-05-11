import { notFound } from "next/navigation";

import prisma from "@/../prisma/db";

import EditWikiClient from "./client";

interface Props {
  params: { id: string };
}

export default async function EditWikiPage({ params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const wiki = await prisma.wiki.findUnique({
    where: { id: id },
  });

  if (!wiki) {
    return notFound();
  }

  const serializedWiki = JSON.parse(JSON.stringify(wiki));

  return <EditWikiClient wiki={serializedWiki} />;
}

// 2240907 Next action: Change description to a text field
// 2240907 Next action: Make Wiki body text fields generative
// 240908 fix structure -> Move edit into [id] folder
