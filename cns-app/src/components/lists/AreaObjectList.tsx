import Link from "next/link";

interface props {
  dataList: GlobalAreaType[] | GlobalObjectType[];
  label: string;
  mapId: number;
}

export default function AreaObjectList({ dataList, label, mapId }: props) {
  return (
    <div className="col-span-3 flex flex-col gap-4" id="area-list">
      <h4 className="text-xl">{label}</h4>
      <div className="flex flex-col gap-4" id="area-container">
        {dataList.map((listItem) => (
          <Link
            key={listItem.id}
            href={`editor/maps/${mapId}/areas/${listItem.id}`}
            className="flex gap-2 p-4 bg-slate-800 text-white rounded-lg hover:opacity-90"
          >
            <h6>{listItem.title}</h6>
          </Link>
        ))}
      </div>
    </div>
  );
}
