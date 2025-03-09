import prisma from "../../../../../prisma/db";
import { notFound } from "next/navigation";
import EditMapClient from "./client";

interface Props {
  params: { id: string };
}

const EditMapPage = async ({ params }: Props) => {
  const id = parseInt(params.id);

  const map = await prisma.map.findUnique({
    where: { id: id },
  });

  if (!map) {
    return notFound();
  }

  const serializedMap = JSON.parse(JSON.stringify(map));

  return <EditMapClient map={serializedMap} />;
};

export default EditMapPage;
