import { Entry, Map, Story } from "@prisma/client";
import prisma from "../../../../prisma/db";
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
import { fetchMapData } from "@/lib/fetchMapData";
import StatusContextProvider from "@/store/statusContext";
import MapModule from "@/components/maps/MapModule";

interface Props {
  story: Entry;
}

const StoryDetail = async ({ story }: Props) => {
  let mapData: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;

  try {
    // 240819 This is stupid - change fetchMapData to always expect an integer
    mapData = await fetchMapData(story.assignedToMapID?.toString() || "");

    if (!mapData.map) {
      error = "Map not found";
    }
  } catch (err) {
    error = "Failed to fetch data";
  }
  // 240819 To Do 1: GlobalObjects are not showing up in stories - Image path is broken
  // 240819 To Do 2: Hook up stories
  return (
    // <div className="lg:grid lg:grid-cols-4">
    //   <Card className="mx-4 mb-4 lg:col-span-3 lg:mr-4">
    //     <CardHeader>
    //       <div className="flex justify-between mb-3">
    //         <EntryStatusBadge status={story.status} />
    //         <EntryRating rating={story.rating} />
    //       </div>
    //       <CardTitle>{story.title}</CardTitle>
    //       <CardDescription>
    //         Created: {formatTime(story.createdAt)}
    //       </CardDescription>
    //     </CardHeader>
    //     <CardContent className="prose dark:prose-invert">
    //       <ReactMarkDown>{story.description}</ReactMarkDown>
    //     </CardContent>
    //     <CardFooter>Last Update: {formatTime(story.updatedAt)}</CardFooter>
    //   </Card>
    //   <div className="mx-4 flex lg:flex-col lg:mx-0 gap-2">
    //     <Link
    //       href={`/stories/edit/${story.id}`}
    //       className={`${buttonVariants({
    //         variant: "default",
    //       })}`}
    //     >
    //       Edit Story
    //     </Link>
    //     <DeleteButton
    //       objectId={story.id}
    //       type="entry"
    //       path="entry"
    //       redirect="stories"
    //     />
    //   </div>
    // </div>
    <div>
      <StatusContextProvider>
        <MapModule data={mapData} />;
      </StatusContextProvider>
    </div>
  );
};

export default StoryDetail;
