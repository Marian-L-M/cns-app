import Image from "next/image";
import Link from "next/link";
import { truncateText } from "@/lib/textUtils";
import { Wiki } from "@prisma/client";
import { ChevronRight } from "lucide-react";

interface Props {
  wikis: Wiki[];
}

function WikiTable({ wikis }: Props) {
  return (
    <div className="w-full rounded-md grid grid-cols-5 gap-4 border  p-4">
      {wikis &&
        wikis.map((wiki) => (
          <div
            className="w-full flex flex-col justify-between gap-2 rounded-xl overflow-hidden border border-gray-200  "
            key={`wiki-${wiki.id}`}
          >
            <div className="img-container relative w-full h-36">
              <Link href={`/wiki/${wiki.id}`}>
                {wiki.thumbUrl ? (
                  <Image
                    src={wiki.thumbUrl}
                    alt="featured wiki"
                    fill={true}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Image
                    src={"/wiki/placeholder-2.jpg"}
                    alt="featured wiki placeholder"
                    fill={true}
                    style={{ objectFit: "cover" }}
                  />
                )}
              </Link>
            </div>
            <div className="mb-auto flex flex-col gap-1 p-4 m-2">
              <h4 className="text-lg font-semibold">{wiki.title}</h4>
              <p className="text-sm">
                {truncateText({ text: wiki.description, limit: 80 })}
              </p>
            </div>
            <Link
              href={`/wiki/${wiki.id}`}
              className=" self-end flex gap-1 py-1 px-2 rounded-md border border-gray-100 hover:opacity-70 m-2"
            >
              View More <ChevronRight />
            </Link>
          </div>
        ))}
      {wikis.length == 0 && <h2>No wikis found</h2>}
    </div>
  );
}

export default WikiTable;
