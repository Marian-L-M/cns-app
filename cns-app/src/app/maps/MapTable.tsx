import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Map } from "@prisma/client";
import Link from "next/link";

interface Props {
  maps: Map[];
}

const MapTable = ({ maps }: Props) => {
  return (
    <div className="grid w-full items-center gap-4 grid-cols-3">
      {maps ? (
        maps.map((mapObject) => (
          <Link href={`/maps/${mapObject.id}`} key={mapObject.id}>
            <Card className="hover:bg-indigo-300/10">
              <CardHeader>
                <CardTitle>{mapObject.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={`/maps/sample-map.jpg`}
                  alt={`${mapObject.title}-thumbnail`}
                  width="480"
                  height="375"
                />
                <CardDescription className="mt-4">
                  {mapObject.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Edit</Button>
                <Button>View</Button>
              </CardFooter>
            </Card>
          </Link>
        ))
      ) : (
        <div>No maps</div>
      )}
    </div>
  );
};

export default MapTable;
