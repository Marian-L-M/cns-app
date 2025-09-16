import Image from "next/image";
import Link from "next/link";
import { truncateText } from "@/lib/textUtils";
import { MapHierarchyMaster } from "@prisma/client";
import { ChevronRight } from "lucide-react";

interface Props {
  masterMaps: MapHierarchyMaster[];
}

export default function MasterMapCardTable({ masterMaps }: Props) {
  return (
    <div className="w-full rounded-md grid grid-cols-5 gap-4 border  p-4">
      {masterMaps &&
        masterMaps.map((mastermap) => (
          <div
            className="w-full flex flex-col justify-between gap-2 rounded-xl overflow-hidden border border-gray-200  "
            key={`mastermap-${mastermap.id}`}
          >
            <div className="img-container relative w-full h-36">
              <Link href={`/mastermaps/${mastermap.id}`}>
                {mastermap.imageUrl ? (
                  <Image
                    src={mastermap.imageUrl}
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
              <h4 className="text-lg font-semibold">{mastermap.title}</h4>
              <p className="text-sm">
                {truncateText({ text: mastermap.description, limit: 80 })}
              </p>
            </div>
            <Link
              href={`/mastermaps/${mastermap.id}`}
              className=" self-end flex gap-1 py-1 px-2 rounded-md border border-gray-100 hover:opacity-70 m-2"
            >
              View More <ChevronRight />
            </Link>
          </div>
        ))}
      {masterMaps.length == 0 && <h2>No mastermaps found</h2>}
    </div>
  );
}
