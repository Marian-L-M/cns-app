import Link from "next/link";
import prisma from "@/../prisma/db";
import MasterMapSearchBar from "@/components/mastermaps/searchbar/MasterMapSearchBar";
import { Button } from "@/components/ui/button";
import MasterMapCardContainer from "@/components/mastermaps/MasterMapCardTable";

export const metadata = {
  title: `Mastermaps`,
};

export interface SearchParams {
  page: string;
  title: string;
  orderBy: Date;
}

export default async function MasterMapPage({
  searchParams: rawSearchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await rawSearchParams;

  const pageSize = 12;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const title = searchParams.title ? searchParams.title : "";

  const settings = {
    where: {
      title: {
        contains: title,
        mode: "insensitive",
      },
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
    include: {
      parentMap: true,
      childMaps: true,
      userMapHierarchies: true,
    },
  };

  const masterMaps = await prisma.mapHierarchyMaster.findMany(settings);

  return (
    <div className="w-full flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Mastermaps</h1>
      <div className="w-full flex flex-col gap-4 border rounded-md p-4">
        <MasterMapSearchBar />
        <Link href="/mastermaps">
          <Button>Reset</Button>
        </Link>
      </div>
      <MasterMapCardContainer masterMaps={masterMaps} />
    </div>
  );
}
