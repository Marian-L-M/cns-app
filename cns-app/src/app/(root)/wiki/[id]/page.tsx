import { ThumbsUp } from "lucide-react";
import ReactMarkDown from "react-markdown";
import Link from "next/link";

import prisma from "@/../prisma/db";

import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InfoBox from "@/components/wiki/InfoBox";

interface WikiPageProps {
  params: { id: string };
}

// 240919 Working but hacky solution
// See if there is a better way to handle this
// Recheck get static props and static paths (Redo max schwarzmueller)
// Add regex check -> change dashes to whitespaces
export default async function WikiPage({ params }: WikiPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  // Check: Does contains work with an integer when comparing to a string?
  let wiki;
  if (!/[a-z]/i.test(id)) {
    wiki = await prisma?.wiki.findUnique({
      where: { id: parseInt(id) },
    });
  } else {
    wiki = await prisma?.wiki.findFirst({
      where: {
        title: { contains: id, mode: "insensitive" },
      },
    });
  }

  if (!wiki) {
    return <p className="text-destructive">Wiki Not Found</p>;
  }

  const infoBox = wiki.infobox as InfoBoxItem[];
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
        <TabsList className="absolute top-0 left-0 -translate-y-full">
          <TabsTrigger value="article">Article</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="revisions">Revisions</TabsTrigger>
        </TabsList>
        <TabsContent className="flex flex-col gap-8" value="article">
          <div
            className="top-content flex justify-between align-bottom"
            id="top-content"
          >
            <div id="title-container">
              <h1 className="text-4xl">{wiki.title}</h1>
              <p>Subtitle</p>
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
          <div className="flex flex-wrap gap-y-8 justify-between">
            <div className="w-9/12 pr-8" id="left-col">
              <div className="flex flex-col gap-4" id="content-col">
                <ReactMarkDown
                  className={"prose lg:prose-xl dark:prose-invert"}
                >
                  {wiki.description}
                </ReactMarkDown>
                <div className="flex flex-col gap-10 " id="main-content">
                  <ReactMarkDown
                    className={"prose lg:prose-xl dark:prose-invert"}
                  >
                    {wiki.wikiText}
                  </ReactMarkDown>
                </div>
              </div>
            </div>
            <div className="w-3/12" id="right-col">
              {infoBox && <InfoBox infoBox={infoBox} />}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="discussion">Discuss contents</TabsContent>
        <TabsContent value="revisions">Revisions</TabsContent>
      </Tabs>
    </div>
  );
}

// Todo 240823 rework database schema to allow name as slug + add content section json fields -> Think about good breakdown
