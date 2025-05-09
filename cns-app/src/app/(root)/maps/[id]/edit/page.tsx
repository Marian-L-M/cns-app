import { notFound } from "next/navigation";
import prisma from "@/../prisma/db";
import EditMapClient from "./client";

interface Props {
  params: { id: string };
}

export default async function EditMapPage({ params }: Props) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);

  const map = await prisma.map.findUnique({
    where: { id: id },
  });

  if (!map) {
    return notFound();
  }

  const serializedMap = JSON.parse(JSON.stringify(map));

  return <EditMapClient map={serializedMap} />;
}
