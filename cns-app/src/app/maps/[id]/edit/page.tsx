import dynamic from "next/dynamic";
import prisma from "../../../../../prisma/db";

interface Props {
  params: { id: string };
}

const MapForm = dynamic(() => import("@/components/forms/MapForm"), {
  ssr: false,
});

const EditMap = async ({ params }: Props) => {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const map = await prisma?.map.findUnique({
    where: { id: id },
  });

  if (!map) {
    return <p className="text-destructive">Map not found</p>;
  }
  return (
    <>
      <MapForm map={map} />
    </>
  );
};

export default EditMap;
