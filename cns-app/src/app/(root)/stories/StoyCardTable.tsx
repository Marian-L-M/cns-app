import Image from "next/image";
import Link from "next/link";
import { truncateText } from "@/lib/textUtils";
import { Story, Wiki } from "@prisma/client";
import { ChevronRight } from "lucide-react";

interface Props {
  stories: Story[];
}

export default function StoryCardTable({ stories }: Props) {
  return (
    <div className="w-full rounded-md grid grid-cols-5 gap-4 border  p-4">
      {stories &&
        stories.map((story) => (
          <div
            className="w-full flex flex-col justify-between gap-2 rounded-xl overflow-hidden border border-gray-200  "
            key={`story-${story.id}`}
          >
            <div className="img-container relative w-full h-36">
              <Link href={`/stories/${story.id}`}>
                {story.imageUrl ? (
                  <Image
                    src={story.imageUrl}
                    alt="featured story"
                    fill={true}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Image
                    src={"/story/placeholder-2.jpg"}
                    alt="featured story placeholder"
                    fill={true}
                    style={{ objectFit: "cover" }}
                  />
                )}
              </Link>
            </div>
            <div className="mb-auto flex flex-col gap-1 p-4 m-2">
              <h4 className="text-lg font-semibold">{story.title}</h4>
              <p className="text-sm">
                {truncateText({ text: story.description, limit: 80 })}
              </p>
            </div>
            <Link
              href={`/stories/${story.id}`}
              className=" self-end flex gap-1 py-1 px-2 rounded-md border border-gray-100 hover:opacity-70 m-2"
            >
              View More <ChevronRight />
            </Link>
          </div>
        ))}
      {stories.length == 0 && <h2>No stories found</h2>}
    </div>
  );
}
