import { SquareChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import prisma from "@/../prisma/db";
import { TabsList } from "@radix-ui/react-tabs";

import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";

export default async function Wiki() {
  const newArticles = await prisma?.wiki.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: 5,
  });
  const featuredCharacters = await prisma?.wiki.findMany({
    where: {
      type: "CHARACTER",
    },
    orderBy: [{ createdAt: "desc" }],
    take: 2,
  });
  const featuredArticles = await prisma?.wiki.findMany({
    where: {
      featured: true,
    },
    orderBy: [{ createdAt: "desc" }],
    take: 2,
  });

  return (
    <div className="flex flex-col gap-20 w-full">
      <Tabs defaultValue="read" className="w-full">
        <TabsList className="absolute top-0 left-0 -translate-y-full">
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="revisions">Revisions</TabsTrigger>
        </TabsList>
        <TabsContent className="flex flex-col gap-8" value="read">
          <div
            className="top-content flex justify-between align-bottom"
            id="top-content"
          >
            <div id="title-container">
              <h1 className="text-4xl">Eternity of Magic Wiki</h1>
              <p className="italic">powered by Clouds and Spaceships</p>
            </div>
            <div
              className="flex flex-col justify-end gap-4 text-sm"
              id="wiki-meta"
            >
              <div className="flex gap-8 justify-between" id="meta-top">
                <Link
                  type="button"
                  className={`${buttonVariants({
                    variant: "outline",
                  })} p-2`}
                  href={`/wiki/new`}
                >
                  Add New
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-x-8 gap-y-12" id="intro-content">
            <h2 className="col-span-4 text-3xl" id="section-title-1">
              Featured Articles
            </h2>
            {/* Featured Articles start */}
            {featuredArticles &&
              featuredArticles.map((article) => (
                <div
                  className="col-span-2 aspect-video relative"
                  key={`featured-article-${article.id}`}
                >
                  <div className="relative w-full h-full flex flex-col gap-1 justify-end z-10 text-white bg-black bg-opacity-25 p-8 rounded-xl">
                    <h4 className="text-2xl">{article.title}</h4>
                    <p>{article.description}</p>
                    <Link
                      href={`/wiki/${article.id}`}
                      className="flex gap-1 self-end mt-4 hover:opacity-70"
                    >
                      <SquareChevronRight /> View More
                    </Link>
                  </div>

                  {article.thumbUrl ? (
                    <Image
                      width={600}
                      height={400}
                      src={article.thumbUrl}
                      alt="featured wiki"
                      className="absolute top-0 left-0 w-full h-full z-0 rounded-xl"
                    />
                  ) : (
                    <Image
                      width={400}
                      height={600}
                      src={"/wiki/placeholder-2.jpg"}
                      alt="featured article placeholder"
                      className="absolute top-0 left-0 w-full h-full z-0 rounded-xl object-cover"
                    />
                  )}
                </div>
              ))}
            {/* Featured Articles end */}
            {/* Start split card */}
            {featuredCharacters && (
              <div
                className="relative col-span-2 flex flex-wrap gap-4"
                id="wiki-split-card-container-1"
              >
                <h4 className="text-2xl w-full" id="container-title-1">
                  Split Card Container
                </h4>
                {featuredCharacters.map((character) => (
                  <div
                    className="flex-1 relative aspect-[2/3]"
                    key={`featured-character-${character.id}`}
                  >
                    <div className="flex h-full w-full flex-col relative gap-1 justify-end z-10 text-white bg-black bg-opacity-25 p-8 rounded-xl">
                      <h4 className="text-2xl">{character.title}</h4>
                      <p>{character.description}</p>
                      <Link
                        href={`/wiki/${character.id}`}
                        className="flex gap-1 self-end mt-4 hover:opacity-70"
                      >
                        <SquareChevronRight /> View More
                      </Link>
                    </div>
                    {character.thumbUrl ? (
                      <Image
                        width={400}
                        height={600}
                        src={character.thumbUrl}
                        alt={character.title}
                        className="absolute top-0 left-0 w-full h-full z-0 rounded-xl object-cover"
                      />
                    ) : (
                      <Image
                        width={400}
                        height={600}
                        src={"/wiki/person-1.jpg"}
                        alt="character placeholder"
                        className="absolute top-0 left-0 w-full h-full z-0 rounded-xl object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* End Split Card */}
            <div
              className="col-span-2 flex flex-col gap-4"
              id="wiki-bars-container"
            >
              <h4 className="text-2xl w-full" id="bars-container-1">
                News bars Container
              </h4>
              {newArticles &&
                newArticles.map((article) => (
                  <Link
                    href={`/wiki/${article.id}`}
                    className="flex w-full items-center gap-4 self-end hover:opacity-70 border-2 border-slate-800 rounded-md p-4"
                    key={`news-bar-${article.id}`}
                  >
                    <SquareChevronRight className="text-2xl" />
                    <h4 className="text-2xl">{article.title}</h4>
                  </Link>
                ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="discussion">Discuss contents</TabsContent>
        <TabsContent value="revisions">Revisions</TabsContent>
      </Tabs>
    </div>
  );
}

// Inspiration
// https://dribbble.com/shots/8659974-Wikipedia-redesign
