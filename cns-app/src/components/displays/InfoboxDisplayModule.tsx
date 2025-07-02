import InfoboxRow from "./parts/InfoboxRow";
import { WikiInfoboxItem } from "@prisma/client";

interface Props {
  infobox?: WikiInfoboxItem[];
}

export default function InfoboxDisplayModule({ infobox }: Props) {
  return (
    <div className="flex flex-col gap-4 bg-slate-50 border border-slate-400 pb-8 rounded-sm py-4 px-2">
      {infobox?.map((infoboxItem) => (
        <div
          key={`infoboxItem-${infoboxItem.id}`}
          className="w-full flex justify-between gap-2 "
        >
          <InfoboxRow infoboxItem={infoboxItem} />
        </div>
      ))}
    </div>
  );
}
