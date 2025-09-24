import ReactMarkDown from "react-markdown";

import prisma from "@/../prisma/db";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import InfoboxDisplayModule from "@/components/displays/InfoboxDisplayModule";
import AuthorDisplayModule from "@/components/displays/AuthorDisplayModule";

interface WikiPageProps {
  params: Promise<{ id: string }>;
}

// 240919 Working but hacky solution
// See if there is a better way to handle this
// Recheck get static props and static paths (Redo max schwarzmueller)
// Add regex check -> change dashes to whitespaces
export default async function WikiPage({ params }: WikiPageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  if (isNaN(id)) {
    return <p className="text-destructive">Invalid url</p>;
  }

  const wiki = await prisma.wiki.findUnique({
    where: { id: id },
    include: {
      userWikis: {
        include: {
          user: {
            select: {
              id: true,
              userProfile: true,
            },
          },
        },
      },
    },
  });

  if (!wiki) {
    return <p className="text-destructive">Wiki Not Found</p>;
  }

  const authors = wiki.userWikis;

  const infobox = await prisma.wikiInfoboxItem.findMany({
    where: { wikiId: id },
    orderBy: { order: "asc" },
  });

  const dateCreated = wiki.createdAt.toLocaleDateString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const dateUpdated = wiki.updatedAt.toLocaleDateString("ja-JP", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-20 w-full">
      <Tabs defaultValue="article" className="w-full">
        {/* <TabsList className="">
          <TabsTrigger value="article">Article</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="revisions">Revisions</TabsTrigger>
        </TabsList> */}
        <TabsContent className="flex flex-col gap-8 px-6 py-4" value="article">
          <div className="w-full flex flex-col gap-8">
            <div
              className="top-content flex justify-between align-bottom"
              id="top-content"
            >
              <div id="title-container">
                <h1 className="text-xl">{wiki.title}</h1>
                {/* <p>Subtitle</p> */}
              </div>
              <div
                className="flex flex-col justify-end gap-4 text-sm"
                id="wiki-meta"
              >
                <div className="flex gap-8 justify-between" id="meta-top">
                  <div className="text-xs text-end" id="wiki-date">
                    <p>Created: {dateCreated}</p>
                    <p>Last Update: {dateUpdated}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full grid grid-cols-12 gap-4">
              <div className="col-span-9" id="left-col">
                <div className="flex flex-col gap-4" id="content-col">
                  <ReactMarkDown
                    className={"prose lg:prose-md dark:prose-invert"}
                  >
                    {wiki.description}
                  </ReactMarkDown>
                  <div className="flex flex-col gap-10 " id="main-content">
                    <ReactMarkDown
                      className={"prose lg:prose-md dark:prose-invert"}
                    >
                      {wiki.wikiText}
                    </ReactMarkDown>
                  </div>
                </div>
              </div>
              <div className="col-span-3 flex flex-col gap-8" id="right-col">
                {infobox.length > 0 && (
                  <InfoboxDisplayModule infobox={infobox} />
                )}
                <AuthorDisplayModule authors={authors} />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="discussion">Discuss contents</TabsContent>
        <TabsContent value="revisions">Revisions</TabsContent>
      </Tabs>
    </div>
  );
}
