import { Entry } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EntryStatusBadge from "@/components/EntryStatusBadge";
import EntryRating from "@/components/EntryRating";
import { formatTime } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ReactMarkDown from "react-markdown";
import DeleteButton from "@/components/buttons/DeleteButton";

interface Props {
  story: Entry;
}

const StoryDetail = ({ story }: Props) => {
  return (
    <div className="lg:grid lg:grid-cols-4">
      <Card className="mx-4 mb-4 lg:col-span-3 lg:mr-4">
        <CardHeader>
          <div className="flex justify-between mb-3">
            <EntryStatusBadge status={story.status} />
            <EntryRating rating={story.rating} />
          </div>
          <CardTitle>{story.title}</CardTitle>
          <CardDescription>
            Created: {formatTime(story.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <ReactMarkDown>{story.description}</ReactMarkDown>
        </CardContent>
        <CardFooter>Last Update: {formatTime(story.updatedAt)}</CardFooter>
      </Card>
      <div className="mx-4 flex lg:flex-col lg:mx-0 gap-2">
        <Link
          href={`/stories/edit/${story.id}`}
          className={`${buttonVariants({
            variant: "default",
          })}`}
        >
          Edit Story
        </Link>
        <DeleteButton
          objectId={story.id}
          type="entry"
          path="entry"
          redirect="stories"
        />
      </div>
    </div>
  );
};

export default StoryDetail;
