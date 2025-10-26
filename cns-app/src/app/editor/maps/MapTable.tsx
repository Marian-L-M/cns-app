import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Map } from "@prisma/client";

interface Props {
  maps: Map[];
}

// To do make Image size dynamic
// To do db naming is confusing imageUrl = Thumbnail url, mapUrl is the main map image
export default function MapTable({ maps }: Props) {
  return (
    <div className="grid w-full items-center gap-6 grid-cols-5 p-4">
      {maps ? (
        maps.map((mapObject) => (
          <Card
            className="hover:bg-indigo-300/10 self-stretch"
            key={mapObject.id}
          >
            <CardHeader>
              <CardTitle>{mapObject.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/maps/${mapObject.id}`} key={mapObject.id}>
                <Image
                  src={`${mapObject.imageUrl}`}
                  alt={`${mapObject.title}-thumbnail`}
                  width="160"
                  height="160"
                />
              </Link>
              <CardDescription className="mt-2">
                {mapObject.description}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={`/editor/maps/${mapObject.id}`}>
                <Button variant="outline">Edit</Button>
              </Link>
              <Link href={`/maps/${mapObject.slug}`}>
                <Button variant="outline">View</Button>
              </Link>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div>No maps</div>
      )}
    </div>
  );
}
