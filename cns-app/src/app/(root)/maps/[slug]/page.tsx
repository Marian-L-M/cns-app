import ReactMarkDown from "react-markdown";
import MapDisplayModule from "@/components/displays/MapDisplayModule";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchMapDataBySlug } from "@/lib/fetchMapData";
import StatusContextProvider from "@/store/statusContext";

interface MapPageProps {
  params: Promise<{ slug: string }>;
}

export default async function MapPage({ params }: MapPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let data: {
    map: MapType | null;
    mapAreas: GlobalAreaType[];
    mapObjects: GlobalObjectType[];
  } = { map: null, mapAreas: [], mapObjects: [] };
  let error: string | null = null;

  try {
    data = await fetchMapDataBySlug(slug);

    if (!data.map) {
      error = "Map not found";
    }
  } catch (err) {
    error = "Failed to fetch data";
  }

  if (!data.map) {
    return <h1 className="text-red-600 text-1xl"> No Map data found</h1>;
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
            <BreadcrumbPage>{data.map.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full flex gap-4">
        <div className="col-span-6">
          <StatusContextProvider>
            <MapDisplayModule data={data} />
          </StatusContextProvider>
        </div>
        <div className="col-span-3 flex flex-col gap-4">
          <h2 className="text-2xl">{data.map.title}</h2>
          <ReactMarkDown className={"prose dark:prose-invert text-md"}>
            {data.map.description}
          </ReactMarkDown>
        </div>
      </div>
    </div>
  );
}
