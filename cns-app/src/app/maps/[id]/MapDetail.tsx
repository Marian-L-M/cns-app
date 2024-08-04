import { Map } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatTime } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ReactMarkDown from "react-markdown";
import DeleteButton from "@/components/buttons/DeleteButton";

import MapModule from "@/components/maps/MapModule";

interface Props {
  map: Map;
}

const MapDetail = ({ map }: Props) => {
  return (
    <div className="">
      {/* <Card className="mx-4 mb-4 lg:col-span-3 lg:mr-4">
        <CardHeader>
          <CardTitle>{map.title}</CardTitle>
          <CardDescription>
            Created: {formatTime(map.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <ReactMarkDown>{map.description}</ReactMarkDown>
        </CardContent>
        <CardContent className="prose dark:prose-invert">
          <p>Thumbnail Url: {map.imageUrl}</p>
          <p>Base Map Url: {map.mapUrl}</p>
          <p>x: {map.x}</p>
          <p>y: {map.x}</p>
          <p>wx: {map.wx}</p>
          <p>wx: {map.wy}</p>
          <p>Map Scale: {map.mapScale}</p>
          <p>Map Time: {map.mapTime}</p>
        </CardContent>
        <CardFooter>Last Update: {formatTime(map.updatedAt)}</CardFooter>
      </Card>
      <div className="mx-4 flex lg:flex-col lg:mx-0 gap-2">
        <Link
          href={`/maps/edit/${map.id}`}
          className={`${buttonVariants({
            variant: "default",
          })}`}
        >
          Edit Map
        </Link>
        <DeleteButton
          objectId={map.id}
          type="map"
          path="maps"
          redirect="maps"
        />
      </div> */}
      <MapModule />
    </div>
  );
};

export default MapDetail;
