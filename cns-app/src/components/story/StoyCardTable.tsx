import { Story } from "@prisma/client";
import StoryCard from "./StoryCard";

interface Props {
  stories: Story[];
}

export default function StoryCardTable({ stories }: Props) {
  return (
    <div className="w-full rounded-md grid grid-cols-5 gap-4 border  p-4">
      {stories &&
        stories.map((story) => (
          <StoryCard story={story} key={`story-${story.id}`} />
        ))}
      {stories.length == 0 && <h2>No stories found</h2>}
    </div>
  );
}
