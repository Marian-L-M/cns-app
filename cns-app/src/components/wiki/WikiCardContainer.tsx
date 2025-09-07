import prisma from "@/../prisma/db";
import { Wiki } from "@prisma/client";

import { SquareChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  amount: number;
  type: string;
}

export default async function WikiCardContainer({ amount, type }: Props) {
  const settings = {
    orderBy: [{ createdAt: "desc" }],
    take: amount,
  };

  let articles: Wiki[] = [];
  let title: string = "Wikis";

  switch (type) {
    case "setNewWikis":
      articles = await prisma?.wiki.findMany({
        orderBy: [{ createdAt: "desc" }],
        take: amount,
      });
      title = "New";
      break;
    case "setFeaturedWikis":
      articles = await prisma?.wiki.findMany({
        where: {
          featured: true,
        },
        orderBy: [{ createdAt: "desc" }],
        take: amount,
      });
      title = "Featured";
      break;
    case "setExploreWikis":
      const articlesCount = await prisma.wiki.count();
      const skip = Math.floor(Math.random() * articlesCount);
      articles = await prisma?.wiki.findMany({
        skip: skip,
        orderBy: {
          createdAt: "desc",
        },
        take: amount,
      });
      title = "Explore";
      break;
  }

  return (
    <div className="w-full flex flex-col gap-4 p-4 border border-gray-200 rounded-xl self-stretch">
      <h3 className="text-xl font-semibold  bg-slate-100 px-2 py-1">{title}</h3>
      {articles.map((article) => (
        <div
          className="rounded-xl overflow-hidden border border-gray-200 "
          key={`featured-article-${article.id}`}
        >
          <div className="img-container relative w-full h-36">
            <Link href={`/wiki/${article.id}`}>
              {article.thumbUrl ? (
                <Image
                  src={article.thumbUrl}
                  alt="featured wiki"
                  fill={true}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <Image
                  src={"/wiki/placeholder-2.jpg"}
                  alt="featured article placeholder"
                  fill={true}
                  style={{ objectFit: "cover" }}
                />
              )}
            </Link>
          </div>
          <div className="w-full h-full flex flex-col gap-1   p-4">
            <h4 className="text-lg font-semibold">{article.title}</h4>
            <p className="text-sm">{article.description}</p>
            <Link
              href={`/wiki/${article.id}`}
              className="flex gap-1 self-end mt-4 hover:opacity-70"
            >
              <SquareChevronRight /> View More
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
