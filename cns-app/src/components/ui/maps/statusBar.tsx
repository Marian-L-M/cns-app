import { useContext } from "react";

import { StatusContext } from "@/store/statusContext";

interface StatusProps {
  title: string;
  id: number;
  type: string;
}

export default function StatusBar(props: StatusProps) {
  const statusCtx = useContext(StatusContext);

  const { title, id, type } = props;

  return (
    <div
      className="flex gap-2 p-1 w-full justify-center bg-zinc-800/75 text-white "
      onClick={statusCtx.hideStatusBar}
    >
      <h2>{title}</h2>
      <h3>{type}</h3>
      <p>ID: {id}</p>
    </div>
  );
}
