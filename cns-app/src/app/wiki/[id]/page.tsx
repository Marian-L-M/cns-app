import prisma from "../../../../prisma/db";
import ReactMarkDown from "react-markdown";
import InfoBox from "@/components/wiki/InfoBox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import Link from "next/link";

interface WikiPageProps {
  params: { id: string };
}

// 240919 Working but hacky solution
// See if there is a better way to handle this
// Recheck get static props and static paths (Redo max schwarzmueller)
// Add regex check -> change dashes to whitespaces
const WikiPage = async ({ params }: WikiPageProps) => {
  let wiki;
  if (!/[a-z]/i.test(params.id)) {
    wiki = await prisma?.wiki.findUnique({
      where: { id: parseInt(params.id) },
    });
  } else {
    wiki = await prisma?.wiki.findFirst({
      where: {
        title: { contains: params.id, mode: "insensitive" },
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
                <Button variant={"ghost"}>
                  <ThumbsUp className="text-lime-900" />
                </Button>
                <div className="text-xs text-end" id="wiki-date">
                  <p>Created: {dateCreated}</p>
                  <p>Last Update: {dateUpdated}</p>
                </div>
                <Link
                  type="button"
                  className={`${buttonVariants({
                    variant: "outline",
                  })} w-16`}
                  href={`/wiki/edit/${wiki.id}`}
                >
                  Edit
                </Link>
              </div>
              <p
                className="bg-slate-100 border-1 rounded-sm px-4 py-1 "
                id="meta-wiki-message"
              >
                Check out related article yada yada
              </p>
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
};

export default WikiPage;

// Todo 240823 rework database schema to allow name as slug + add content section json fields -> Think about good breakdown
