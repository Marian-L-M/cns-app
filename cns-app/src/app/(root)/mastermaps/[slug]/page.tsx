import MasterMapModule from "@/components/displays/MastermapDisplayModule";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchMasterMap, fetchMasterMapBySlug } from "@/lib/fetchMapData";
import CursorContextProvider from "@/store/cursorContext";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ReactMarkDown from "react-markdown";

interface MapPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MasterMapPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const masterMap = await fetchMasterMapBySlug(slug);

  if (!masterMap) {
    return <div className="text-destructive">No Mastermaps found</div>;
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Breadcrumb>
        <BreadcrumbList className="text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/maps">Maps</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{masterMap.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex flex-col gap-8  min-h-full py-2">
        <div id="banner-container"></div>
        <div className="w-full grid grid-cols-8 gap-4" id="content-container">
          <div className="col-span-6">
            <CursorContextProvider>
              <MasterMapModule masterMap={masterMap} />
            </CursorContextProvider>
          </div>
          <div className="col-span-2 flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{masterMap.title}</h2>
            <div className="py-2" id="text-container">
              <ReactMarkDown className={"prose dark:prose-invert text-sm"}>
                {masterMap.description}
              </ReactMarkDown>
            </div>
            <div className="flex flex-col gap-2" id="submaps">
              <h4 className="text-lg font-semibold">Childmaps</h4>
              {masterMap.childMaps.map((childMap) => (
                <Link
                  key={`childmap-${childMap.id}`}
                  href={`/maps/${childMap.slug}`}
                  className="w-full flex items-center justify-between gap-2 border border-slate-100 px-2 py-1 rounded-md hover:opacity-80"
                >
                  {childMap.title}
                  <ChevronRight />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
