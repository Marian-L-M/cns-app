import { ChevronRight } from "lucide-react";
import Link from "next/link";
import prisma from "@/../prisma/db";
import { TabsList } from "@radix-ui/react-tabs";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import FeaturedCards from "./FeaturedCards";

export default async function Wiki() {
  const newArticles = await prisma?.wiki.findMany({
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

  const articlesCount = await prisma.wiki.count();
  const skip = Math.floor(Math.random() * articlesCount);
  const randomArticles = await prisma.wiki.findMany({
    take: 4,
    skip: skip,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col gap-20 w-full">
      <Tabs defaultValue="read" className="w-full">
        {/* <TabsList className="absolute top-0 left-0 -translate-y-full">
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
          <TabsTrigger value="revisions">Revisions</TabsTrigger>
        </TabsList> */}
        <TabsContent className="flex flex-col gap-8" value="read">
          <div className="grid grid-cols-8 gap-4" id="intro-content">
            <div className="col-span-6 flex flex-wrap gap-4" id="main-contents">
              <h2 className="w-full text-2xl font-bold ">
                Eternity of Magic Wiki
              </h2>
              <div className="w-full flex flex-col gap-2 col-span-8 p-4 border border-gray-200 rounded-xl">
                <div className="w-full flex flex-col gap-2">
                  <h3 className="text-lg font-semibold  bg-slate-100 px-2 py-1">
                    Welcome to the Eternity of Magic Wiki
                  </h3>
                  <p>
                    Learn more about whats going on in the world of Kamolin.
                  </p>
                </div>
              </div>
              {/* Featured Articles */}
              {featuredArticles && (
                <FeaturedCards
                  articles={featuredArticles}
                  title={"Featured Articles"}
                />
              )}
              {/* New Articles */}
              {newArticles && (
                <FeaturedCards articles={newArticles} title={"New Articles"} />
              )}
              <div className="flex-1 flex flex-col gap-4 p-4 border border-gray-200 rounded-xl self-stretch">
                <h4 className="text-lg  font-semibold  bg-slate-100 px-2 py-1">
                  Did you know?
                </h4>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Officia natus eligendi corporis tempora quibusdam architecto,
                  rerum minus dignissimos vero provident perspiciatis in sint
                  veniam minima rem eaque. Tempora odio quis rerum quaerat
                  nesciunt laborum amet ut sapiente magni velit eius neque,
                  nostrum, in provident nemo unde ipsam qui assumenda?
                </p>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Officia natus eligendi corporis tempora quibusdam architecto,
                  rerum minus dignissimos vero provident perspiciatis in sint
                  veniam minima rem eaque. Tempora odio quis rerum quaerat
                  nesciunt laborum amet ut sapiente magni velit eius neque,
                  nostrum, in provident nemo unde ipsam qui assumenda?
                </p>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Officia natus eligendi corporis tempora quibusdam architecto,
                  rerum minus dignissimos vero provident perspiciatis in sint
                  veniam minima rem eaque. Tempora odio quis rerum quaerat
                  nesciunt laborum amet ut sapiente magni velit eius neque,
                  nostrum, in provident nemo unde ipsam qui assumenda?
                </p>
              </div>
            </div>
            <div
              className="col-span-2 flex flex-col gap-2 p-4 border border-gray-200 rounded-xl self-stretch"
              id="wiki-bars-container"
            >
              <h4
                className="text-xl font-semibold bg-slate-100 px-2 py-1"
                id="bars-container-1"
              >
                Explore
              </h4>
              {randomArticles &&
                randomArticles.map((article) => (
                  <Link
                    href={`/wiki/${article.id}`}
                    className="flex w-full items-center gap-2 self-end hover:opacity-70 border border-grey-100 rounded-md px-4 py-2"
                    key={`news-bar-${article.id}`}
                  >
                    <ChevronRight className="text-sm" />
                    <h4 className="text-sm">{article.title}</h4>
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
