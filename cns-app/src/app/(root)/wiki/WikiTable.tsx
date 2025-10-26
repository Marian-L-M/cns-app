import { Wiki } from "@prisma/client";
import WikiCard from "./WikiCard";

interface Props {
  wikis: Wiki[];
}

export default function WikiTable({ wikis }: Props) {
  return (
    <div className="w-full rounded-md grid grid-cols-5 gap-4 border  p-4">
      {wikis &&
        wikis.map((wiki) => <WikiCard wiki={wiki} key={`wiki-${wiki.id}`} />)}
      {wikis.length == 0 && <h2>No wikis found</h2>}
    </div>
  );
}
