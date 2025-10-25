import Image from "next/image";
import Link from "next/link";
import { truncateText } from "@/lib/textUtils";
import { Wiki } from "@prisma/client";
import { ChevronRight } from "lucide-react";

interface Props {
  wiki: Wiki;
}

export default function WikiCard({ wiki }: Props) {
  return (
    <div className="w-full flex flex-col justify-between gap-2 rounded-xl overflow-hidden border border-gray-200  ">
      <div className="img-container relative w-full h-36">
        <Link href={`/wiki/${wiki.slug}`}>
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
        href={`/wiki/${wiki.slug}`}
        className=" self-end flex gap-1 py-1 px-2 rounded-md border border-gray-100 hover:opacity-70 m-2"
      >
        View More <ChevronRight />
      </Link>
    </div>
  );
}
