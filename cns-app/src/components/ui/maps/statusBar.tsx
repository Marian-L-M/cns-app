import { useContext } from "react";

import StatusContext from "@/store/statusContext";

interface StatusProps {
  title: string;
  subtitle: string;
  status: string;
}

function StatusBar(props: StatusProps) {
  const statusCtx = useContext(StatusContext);

  const { title, subtitle, status } = props;

  let statusClasses = "";

  if (status === "success") {
    statusClasses = "success";
  }

  if (status === "error") {
    statusClasses = "error";
  }

  if (status === "pending") {
    statusClasses = "pending";
  }

  return (
    <div className="placeholder-classname" onClick={statusCtx.hideStatus}>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

export default StatusBar;
