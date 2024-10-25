import dynamic from "next/dynamic";
import prisma from "../../../../../prisma/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  params: { id: string };
}

const MapForm = dynamic(() => import("@/components/forms/MapForm"), {
  ssr: false,
});

const EditMap = async ({ params }: Props) => {
  const map = await prisma?.map.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!map) {
    return <p className="text-destructive">Map not found</p>;
  }
  return (
    <>
      {/* <div className="flex gap-2 justify-end mb-4">
        <Link href={`/maps/edit/${params.id}/areas`}>
          <Button variant={"secondary"}>Areas</Button>
        </Link>
        <Link href={`/maps/edit/${params.id}/objects`}>
          <Button variant={"secondary"}>Objects</Button>
        </Link>
      </div> */}
      <MapForm map={map} />
    </>
  );
};

export default EditMap;
