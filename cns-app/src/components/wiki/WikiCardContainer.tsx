import prisma from "@/../prisma/db";
import WikiCard from "@/app/(root)/wiki/WikiCard";
import { Wiki } from "@prisma/client";

interface Props {
  amount: number;
  type: string;
}

export default async function WikiCardContainer({ amount, type }: Props) {
  const settings = {
    orderBy: [{ createdAt: "desc" }],
    take: amount,
  };

  let wikis: Wiki[] = [];
  let title: string = "Wikis";

  switch (type) {
    case "setNewWikis":
      wikis = await prisma?.wiki.findMany({
        orderBy: [{ createdAt: "desc" }],
        take: amount,
      });
      title = "New";
      break;
    case "setFeaturedWikis":
      wikis = await prisma?.wiki.findMany({
        where: {
          featured: true,
        },
        orderBy: [{ createdAt: "desc" }],
        take: amount,
      });
      title = "Featured";
      break;
    case "setExploreWikis":
      const wikisCount = await prisma.wiki.count();
      const skip = Math.floor(Math.random() * wikisCount);
      wikis = await prisma?.wiki.findMany({
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
      {wikis.map((wiki) => (
        <WikiCard wiki={wiki} key={`wiki-${wiki.id}`} />
      ))}
    </div>
  );
}
