import Image from "next/image";
import Link from "next/link";
import { truncateText } from "@/lib/textUtils";
import { ChevronRight } from "lucide-react";
import { MapHierarchyMaster } from "@prisma/client";

interface Props {
  masterMap: MapHierarchyMaster;
}

export default function MasterMapCard({ masterMap }: Props) {
  return (
    <div className="w-full flex flex-col justify-between gap-2 rounded-xl overflow-hidden border border-gray-200 ">
      <div className="img-container relative w-full h-36">
        <Link href={`/mastermaps/${masterMap.slug}`}>
          {masterMap.imageUrl ? (
            <Image
              src={masterMap.imageUrl}
              alt="featured mastermap"
              fill={true}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <Image
              src={"/mastermap/placeholder-2.jpg"}
              alt="featured mastermap placeholder"
              fill={true}
              style={{ objectFit: "cover" }}
            />
          )}
        </Link>
      </div>
      <div className="mb-auto flex flex-col gap-1 p-4 m-2">
        <h4 className="text-lg font-semibold">{masterMap.title}</h4>
        <p className="text-sm">
          {truncateText({ text: masterMap.description, limit: 80 })}
        </p>
      </div>
      <Link
        href={`/mastermaps/${masterMap.slug}`}
        className=" self-end flex gap-1 py-1 px-2 rounded-md border border-gray-100 hover:opacity-70 m-2"
      >
        View More <ChevronRight />
      </Link>
    </div>
  );
}
