import Image from "next/image";
import { WikiInfoboxItem } from "@prisma/client";

interface Props {
  infoboxItem: WikiInfoboxItem;
}

type BarType = {
  key: string;
  value: string;
};

export default function InfoboxRow({ infoboxItem }: Props) {
  return (
    <div className="w-full">
      {infoboxItem.type == "TITLE" && (
        // Type Title
        <div className="w-full">
          <h2 className="text-lg w-full bg-gray-200 text-center mb-2">
            {infoboxItem.title}
          </h2>
        </div>
      )}
      {infoboxItem.type == "IMAGE" && (
        // Type image with optional caption
        <div className="w-full max-w-3xs flex flex-col items-center">
          <Image
            width={250}
            height={250}
            src={infoboxItem.imageUrl}
            alt={infoboxItem.caption}
          />
          {infoboxItem.caption && (
            <h3 className="w-full text-md text-center mb-2">
              {infoboxItem.caption}
            </h3>
          )}
        </div>
      )}
      {infoboxItem.type == "TEXT" && (
        // Type Text with optional title
        <div className="w-full">
          {infoboxItem.title && (
            <h3 className="text-md w-full bg-gray-200 text-center mb-2">
              {infoboxItem.title}
            </h3>
          )}
          <p className="text-sm">{infoboxItem.description}</p>
        </div>
      )}
      {infoboxItem.type === "COLLECTION" && (
        // Type collection
        <div className="w-full">
          {infoboxItem.collections?.map((collection: any) => (
            <div key={`collection-${collection?.title}`}>
              <h3 className="w-full text-md bg-gray-200 text-center mb-2">
                {collection?.title}
              </h3>
              <div className="text-xs flex flex-col gap-1">
                {collection?.bars?.map((bar: BarType) => (
                  <div key={`bar-${bar?.value}`} className="flex gap-2">
                    <span className="font-bold w-1/4">{bar.key}</span>
                    <span className="w-3/4">{bar.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
