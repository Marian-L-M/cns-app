import { Map } from "@prisma/client";

import { SquareChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  map: Map;
}

export default function MapCard({ map }: Props) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 ">
      <div className="img-container relative w-full h-36">
        <Link href={`/maps/${map.slug}`}>
          {map.imageUrl ? (
            <Image
              src={map.imageUrl}
              alt="featured wiki"
              fill={true}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <Image
              src={"/wiki/placeholder-2.jpg"}
              alt="featured map placeholder"
              fill={true}
              style={{ objectFit: "cover" }}
            />
          )}
        </Link>
      </div>
      <div className="w-full h-full flex flex-col gap-1   p-4">
        <h4 className="text-lg font-semibold">{map.title}</h4>
        <p className="text-sm">{map.description}</p>
        <Link
          href={`/maps/${map.slug}`}
          className="flex gap-1 self-end mt-4 hover:opacity-70"
        >
          <SquareChevronRight /> View More
        </Link>
      </div>
    </div>
  );
}
