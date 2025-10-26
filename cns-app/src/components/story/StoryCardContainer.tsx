import prisma from "@/../prisma/db";
import { Story } from "@prisma/client";

import StoryCard from "./StoryCard";

interface Props {
  amount: number;
  type: string;
}

export default async function StoryCardContainer({ amount, type }: Props) {
  const settings = {
    orderBy: [{ createdAt: "desc" }],
    take: amount,
  };

  let stories: Story[] = [];
  let title: string = "Stories";

  switch (type) {
    case "setNewStories":
      stories = await prisma?.story.findMany({
        orderBy: [{ createdAt: "desc" }],
        take: amount,
      });
      title = "New";
      break;
    case "setFeaturedStories":
      stories = await prisma?.story.findMany({
        where: {
          featured: true,
        },
        orderBy: [{ createdAt: "desc" }],
        take: amount,
      });
      title = "Featured";
      break;
    case "setExploreStories":
      const storiesCount = await prisma.story.count();
      const skip = Math.floor(Math.random() * storiesCount);
      stories = await prisma?.story.findMany({
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
      {stories.map((story) => (
        <StoryCard story={story} key={`story-${story.id}`} />
      ))}
    </div>
  );
}
