import prisma from "../../../../prisma/db";
import MapDetail from "./MapDetail";

interface Props {
  params: { id: string };
}

const mapPage = async ({ params }: Props) => {
  const map = await prisma.map.findUnique({
    where: { id: parseInt(params.id) },
  });
  if (!map) {
    return <div className="text-destructive">Map not found</div>;
  }
  return <MapDetail map={map} />;
};

export default mapPage;
