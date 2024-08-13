import { useContext } from "react";

import StatusContext from "@/store/statusContext";

interface StatusProps {
  title: string;
  id: number;
  type: string;
}

function StatusBar(props: StatusProps) {
  const statusCtx = useContext(StatusContext);

  const { title, id, type } = props;

  return (
    <div className="placeholder-classname" onClick={statusCtx.hideStatus}>
      <h2>{title}</h2>
      <h3>{type}</h3>
      <p>ID: {id}</p>
    </div>
  );
}

export default StatusBar;
