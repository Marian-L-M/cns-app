import { Wiki } from "@prisma/client";
import { SquareChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  articles: Wiki[];
}

export default function FeaturedCards({ articles, title }: Props) {
  return (
    <div className="flex flex-col gap-4 col-span-2">
      <h3 className="text-xl">{title}</h3>
      {articles.map((article) => (
        <div
          className="rounded-xl overflow-hidden border border-gray-200"
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
