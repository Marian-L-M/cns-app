import { Status } from "@prisma/client";
import { Badge } from "./ui/badge";

interface Props {
  status: Status;
}

const statusMap: Record<
  Status,
  { label: string; color: "bg-red-400" | "bg-blue-400" | "bg-green-400" }
> = {
  COMPLETED: { label: "Completed", color: "bg-green-400" },
  ONGOING: { label: "Ongoing", color: "bg-blue-400" },
  UPCOMING: { label: "Upcoming", color: "bg-red-400" },
};

const EntryStatusBadge = ({ status }: Props) => {
  return (
    <Badge
      className={`${statusMap[status].color} text-background hover:${statusMap[status].color}`}
    >
      {statusMap[status].label}
    </Badge>
  );
};

export default EntryStatusBadge;
