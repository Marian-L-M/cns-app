import Image from "next/image";
import Link from "next/link";
import { truncateText } from "@/lib/textUtils";
import { Map } from "@prisma/client";
import { ChevronRight } from "lucide-react";

interface Props {
  maps: Map[];
}

export default function MapCardTable({ maps }: Props) {
  return (
    <div className="w-full rounded-md grid grid-cols-5 gap-4 border  p-4">
      {maps &&
        maps.map((map) => (
          <div
            className="w-full flex flex-col justify-between gap-2 rounded-xl overflow-hidden border border-gray-200  "
            key={`map-${map.id}`}
          >
            <div className="img-container relative w-full h-36">
              <Link href={`/maps/${map.id}`}>
                {map.imageUrl ? (
                  <Image
                    src={map.imageUrl}
                    alt={`${map.title}-map`}
                    fill={true}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Image
                    src={"/maps/placeholder-2.jpg"}
                    alt=" map placeholder"
                    fill={true}
                    style={{ objectFit: "cover" }}
                  />
                )}
              </Link>
            </div>
            <div className="mb-auto flex flex-col gap-1 p-4 m-2">
              <h4 className="text-lg font-semibold">{map.title}</h4>
              <p className="text-sm">
                {truncateText({ text: map.description, limit: 80 })}
              </p>
            </div>
            <Link
              href={`/maps/${map.id}`}
              className=" self-end flex gap-1 py-1 px-2 rounded-md border border-gray-100 hover:opacity-70 m-2"
            >
              View More <ChevronRight />
            </Link>
          </div>
        ))}
      {maps.length == 0 && <h2>No maps found</h2>}
    </div>
  );
}
